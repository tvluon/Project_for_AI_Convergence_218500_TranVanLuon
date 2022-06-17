import os
from data.dataset import Dataset

class MVTECDataset(Dataset):
    def __init__(self, kind, cfg):
        super(MVTECDataset, self).__init__(os.path.join(cfg.DATASET_PATH, f"{cfg.FOLD}"), cfg, kind)
        self.read_contents()

    def read_contents(self):
        if not self.cfg.ON_DEMAND_READ:
            raise Exception("Need to implement eager loading!")

        pos_samples, neg_samples = [], []

        neg_dir = os.path.join(self.path, "train", "good")
        # annotations = read_annotations(fn)

        # samples = read_split(self.cfg.TRAIN_NUM, self.cfg.NUM_SEGMENTED, self.kind)
        for sample in os.listdir(neg_dir):
            img_name = sample
            img_path = os.path.join(neg_dir, img_name)

            # if sample in annotations:
            #     rle = list(map(int, annotations[sample].split(" ")))
            #     pos_samples.append((None, None, None, is_segmented, img_path, rle, sample))
            # else:
            
            neg_samples.append((None, None, None, True, img_path, None, sample))
        
        pos_dir = os.path.join(self.path, "test")
        mask_dir = os.path.join(self.path, "ground_truth")
        pos_sub_dirs = os.listdir(pos_dir)

        for sub_dir in pos_sub_dirs:
            if sub_dir == "good":
                continue
            
            sub_dir_path = os.path.join(pos_dir, sub_dir)

            for sample in os.listdir(sub_dir_path):
                img_name = sample
                img_path = os.path.join(sub_dir_path, img_name)

                mask_path = os.path.join(mask_dir, sub_dir, img_name.replace('.png', "_mask.png"))
                
                pos_samples.append((None, None, None, True, img_path, mask_path, sample))
                

        self.pos_samples = pos_samples
        self.neg_samples = neg_samples

        self.num_pos = len(pos_samples)
        self.num_neg = len(neg_samples)
        self.len = 2 * len(pos_samples) if self.kind in ['TRAIN'] else len(pos_samples) + len(neg_samples)

        self.init_extra()
