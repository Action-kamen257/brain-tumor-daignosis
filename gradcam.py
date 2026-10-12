import torch
import cv2
import numpy as np


def generate_gradcam(model, image_tensor, target_class):
    gradients = []
    activations = []

    # Last convolution layer (ResNet style)
    target_layer = model.layer4[-1]

    def forward_hook(module, inp, out):
        activations.append(out)

    def backward_hook(module, grad_in, grad_out):
        gradients.append(grad_out[0])

    fh = target_layer.register_forward_hook(forward_hook)
    bh = target_layer.register_full_backward_hook(backward_hook)

    image_tensor.requires_grad = True

    output = model(image_tensor)
    loss = output[:, target_class]

    model.zero_grad()
    loss.backward()

    grads = gradients[0]
    acts = activations[0]

    # Global average pooling on gradients
    weights = torch.mean(grads, dim=(2, 3))

    cam = torch.zeros(acts.shape[2:], dtype=torch.float32).to(image_tensor.device)

    for i, w in enumerate(weights[0]):
        cam += w * acts[0, i, :, :]

    cam = torch.relu(cam)
    cam = cam.cpu().detach().numpy()

    # Normalize (IMPORTANT)
    cam = cam - np.min(cam)
    cam = cam / (np.max(cam) + 1e-8)

    fh.remove()
    bh.remove()

    return cam


def overlay_heatmap(original_img, cam):
    """
    original_img: numpy image (H, W, 3) or (H, W)
    cam: Grad-CAM output (Hc, Wc)
    """

    # 🔥 Resize CAM to original image size
    cam = cv2.resize(cam, (original_img.shape[1], original_img.shape[0]))

    # Convert to 0–255
    heatmap = np.uint8(255 * cam)

    # Apply colormap
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Ensure original image is uint8
    if original_img.dtype != np.uint8:
        original_img = np.uint8(255 * original_img)

    # If grayscale → convert to 3 channels
    if len(original_img.shape) == 2:
        original_img = cv2.cvtColor(original_img, cv2.COLOR_GRAY2BGR)

    # 🔥 FINAL SAFE BLEND
    overlay = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)

    return overlay