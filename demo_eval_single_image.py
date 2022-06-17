from models import SegDecNet
import cv2
import torch
import numpy as np
import matplotlib.pyplot as plt

# INPUT_WIDTH = 512  # must be the same as it was during training
# INPUT_HEIGHT = 1408  # must be the same as it was during training
# INPUT_CHANNELS = 1  # must be the same as it was during training

INPUT_WIDTH = 1600
INPUT_HEIGHT = 256
INPUT_CHANNELS = 1

device = "cpu"  # cpu or cuda:IX

model = SegDecNet(device, INPUT_WIDTH, INPUT_HEIGHT, INPUT_CHANNELS)
model.set_gradient_multipliers(0)

model_path = "./results/STEEL/ALL_3000_N_3000/models/best_state_dict.pth"
model.load_state_dict(torch.load(model_path, map_location=device))

# %%
img_path = "./datasets/STEEL/train_images/f71c37a0f.jpg"
img = cv2.imread(img_path) if INPUT_CHANNELS == 3 else cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
# print(img)
old_img = img
img = cv2.resize(img, (INPUT_WIDTH, INPUT_HEIGHT))
img = np.transpose(img, (2, 0, 1)) if INPUT_CHANNELS == 3 else img[np.newaxis]
img_t = torch.from_numpy(img)[np.newaxis].float() / 255.0  # must be [BATCH_SIZE x CHANNELS x HEIGHT x WIDTH]

dec_out, seg_out = model(img_t)
# cv2.imwrite(img_path.split('/')[-1],seg_out.cpu().detach().numpy()[0][0])

img_score = torch.sigmoid(dec_out)
print(img_score)

dsize = INPUT_WIDTH, INPUT_HEIGHT

seg_out = seg_out.cpu().detach().numpy()

seg_out = cv2.resize(seg_out[0, 0, :, :], dsize) if len(seg_out.shape) == 4 else cv2.resize(seg_out[0, :, :], dsize)

# img = img_t.detach().cpu().numpy()
# img = cv2.resize(np.transpose(img[0, :, :, :], (1, 2, 0)), dsize)
img = old_img

if img.shape[0] < img.shape[1]:
    img = np.transpose(img)
    seg_out = np.transpose(seg_out)

plt.figure()
plt.clf()
plt.subplot(1, 2, 1)
plt.xticks([])
plt.yticks([])
plt.imshow(img, cmap="gray")


plt.subplot(1, 2, 2)
plt.xticks([])
plt.yticks([])
vmax_value = max(1, np.max(seg_out))
plt.imshow(seg_out, cmap="jet", vmax=vmax_value)


# plt.savefig(img_path.split('/')[-1])

plt.savefig(img_path.split('/')[-1], bbox_inches='tight', dpi=300)
plt.close()