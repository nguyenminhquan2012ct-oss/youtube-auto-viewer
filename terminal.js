git clone https://github.com/nguyenminhquan2012ct-oss/youtube-auto-viewer.git
cd youtube-auto-viewer

# Tạo file auto-viewer.js
cat > auto-viewer.js << 'EOF'
// YouTube Auto Viewer v1.0.0
const CONFIG = {
  videoSelector: 'a#video-title-link',
  autoSkipAds: true,
  playbackSpeed: 1.0,
  minWatchTime: 3,
  delayBetweenVideos: 1000,
  debugMode: true,
};

let youtubeAutoViewerStop = false;
let youtubeAutoViewerState = {
  isRunning: false,
  watched: 0,
  total: 0,
  startTime: null,
};

function log(message, type = 'info') {
  const time = new Date().toLocaleTimeString();
  const icons = {
    info: '📋',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    start: '🚀',
    play: '▶️',
    done: '🎉',
    progress: '📊',
  };
  console.log(`[${time}] ${icons[type] || '📌'} ${message}`);
}

function youtubeAutoViewerStatus() {
  const { isRunning, watched, total, startTime } = youtubeAutoViewerState;
  const elapsed = startTime ? ((Date.now() - startTime) / 1000 / 60).toFixed(2) : 0;
  
  console.group('📊 YouTube Auto Viewer Status');
  console.log(`Is Running: ${isRunning ? '✅ YES' : '❌ NO'}`);
  console.log(`Watched: ${watched}/${total}`);
  console.log(`Progress: ${total > 0 ? ((watched/total)*100).toFixed(1) : 0}%`);
  console.log(`Elapsed: ${elapsed} minutes`);
  console.groupEnd();
}

async function youtubeAutoViewerStart() {
  if (youtubeAutoViewerState.isRunning) {
    log('⚠️ Script đang chạy rồi!', 'warning');
    return;
  }

  log('YouTube Auto Viewer Started 🚀', 'start');
  log('⚠️ Lưu ý: Tool này chỉ dùng cho mục đích cá nhân', 'warning');

  youtubeAutoViewerStop = false;
  youtubeAutoViewerState.isRunning = true;
  youtubeAutoViewerState.startTime = Date.now();

  try {
    const videoElements = document.querySelectorAll(CONFIG.videoSelector);
    const videos = Array.from(videoElements)
      .filter(el => el.href)
      .map(el => el.href)
      .filter((val, idx, arr) => arr.indexOf(val) === idx);

    youtubeAutoViewerState.total = videos.length;
    log(`Loaded: ${videos.length} videos...`, 'info');

    if (videos.length === 0) {
      log('❌ Không tìm thấy video nào!', 'error');
      youtubeAutoViewerState.isRunning = false;
      return;
    }

    log(`Bắt đầu xem ${videos.length} videos`, 'success');

    for (let i = 0; i < videos.length; i++) {
      if (youtubeAutoViewerStop) {
        log('⛔ Script dừng bởi người dùng', 'warning');
        break;
      }

      const videoUrl = videos[i];
      
      log(`Progress: ${i + 1}/${videos.length}`, 'progress');
      log(`Playing: Video ${i + 1}`, 'play');

      window.location.href = videoUrl;
      await new Promise(resolve => setTimeout(resolve, 3000));

      const video = document.querySelector('video');
      if (video) {
        video.playbackRate = CONFIG.playbackSpeed;
        log(`⚙️ Speed: ${CONFIG.playbackSpeed}x`, 'info');
      }

      const duration = video?.duration || CONFIG.minWatchTime;
      const watchTime = Math.max(CONFIG.minWatchTime, duration / CONFIG.playbackSpeed);

      log(`⏱️ Watch time: ${watchTime.toFixed(1)}s`, 'info');
      await new Promise(resolve => setTimeout(resolve, watchTime * 1000));

      if (CONFIG.autoSkipAds) {
        const skipBtn = document.querySelector('.ytp-ad-skip-button');
        if (skipBtn) {
          skipBtn.click();
          log('⏭️ Skipped ad', 'info');
        }
      }

      youtubeAutoViewerState.watched = i + 1;
      log(`Watched: Video ${i + 1}`, 'success');

      if (i < videos.length - 1) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenVideos));
      }
    }

    log(`Đã hoàn thành! 🎉`, 'done');
    log(`Xem: ${youtubeAutoViewerState.watched}/${youtubeAutoViewerState.total} videos`, 'success');

    const totalTime = (Date.now() - youtubeAutoViewerState.startTime) / 1000 / 60;
    log(`Thời gian: ${totalTime.toFixed(2)} phút`, 'info');

  } catch (error) {
    log(`❌ Error: ${error.message}`, 'error');
    console.error(error);
  } finally {
    youtubeAutoViewerState.isRunning = false;
  }
}

log('✅ YouTube Auto Viewer loaded!', 'success');
log('Dùng lệnh: youtubeAutoViewerStart()', 'info');
log('Để dừng: youtubeAutoViewerStop = true', 'info');
EOF

# Tạo file README.md
cat > README.md << 'EOF'
# 🎬 YouTube Auto Viewer

Công cụ tự động xem hết tất cả video trên một kênh YouTube thông qua DevTools Console.

## ⚡ Cách sử dụng nhanh

1. **Truy cập channel YouTube**: 
