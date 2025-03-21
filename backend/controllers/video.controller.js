import Progress from "../models/Progress.js";


export const updateVideoProgress = async (req, res) => {
  const { userId, videoId, watchedTime, videoDuration } = req.body;

  try {
    let progress = await Progress.findOne({ user: userId, video: videoId });

    if (!progress) {
      progress = new Progress({
        user: userId,
        video: videoId,
        watchedTime,
        isCompleted: watchedTime >= videoDuration * 0.9,
      });
    } else {
      progress.watchedTime = Math.max(progress.watchedTime, watchedTime);
      progress.isCompleted = progress.watchedTime >= videoDuration * 0.9;
    }

    await progress.save();
    res.json({ message: "Progress updated successfully", progress });
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress" });
  }
};

export const getVideoProgress = async (req, res) => {
  const { userId, videoId } = req.params;

  try {
    const progress = await Progress.findOne({ user: userId, video: videoId });

    if (!progress) {
      return res.json({ watchedTime: 0, isCompleted: false });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve progress" });
  }
};
 