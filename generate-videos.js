// ═══════════════════════════════════════════════
// ElectroAI — Sequential Video Generation
// Submit → Wait → Download → Next (one at a time)
// Run: node generate-videos.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "sk-8416cebc565f4a29859985e269834580";
const API_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";
const SAVE_FOLDER = "E:\\NB\\Frames\\videos\\Set2WANHD";

const SCENES = [
  {
    scene: 1,
    title: "Worried_Customer",
    prompt: "Worried young woman sitting at home checking phone anxiously, waiting for delivery, realistic style, cinematic lighting, 4K"
  },
  {
    scene: 2,
    title: "Lost_Package_Warehouse",
    prompt: "Chaotic warehouse with lost packages, confused workers, overwhelmed staff, boxes everywhere, realistic cinematic style, 4K"
  },
  {
    scene: 3,
    title: "Opens_ElectroAI_Chatbot",
    prompt: "Woman typing on phone, modern AI chat interface glowing on screen, hopeful expression, futuristic UI, cinematic lighting, 4K"
  },
  {
    scene: 4,
    title: "TechBot_Finds_Order",
    prompt: "AI chatbot interface showing order found, English text, happy notification, green checkmark appearing, futuristic UI glow effect, modern technology"
  },
  {
    scene: 5,
    title: "Package_Arrives",
    prompt: "Happy young woman receiving package at door, smiling joyfully, sunny day, warm cinematic lighting, realistic style, 4K"
  },
  {
    scene: 6,
    title: "ElectroAI_Logo_Closing",
    prompt: "Futuristic ElectroAI logo animation, orange glow effect, Alibaba Cloud powered text, clean dark background, cinematic quality"
  }
];

// ── Helper: wait ──
function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

// ── Create save folder ──
function createFolder() {
  if (!fs.existsSync(SAVE_FOLDER)) {
    fs.mkdirSync(SAVE_FOLDER, { recursive: true });
    console.log("📁 Created folder: " + SAVE_FOLDER);
  }
}

// ── Step 1: Submit one task ──
async function submitTask(scene) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎬 SCENE " + scene.scene + " of " + SCENES.length + ": " + scene.title);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📤 Submitting...");

  var retries = 3;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json",
          "X-DashScope-Async": "enable"
        },
        body: JSON.stringify({
          model: "wan2.6-t2v",
          input: { prompt: scene.prompt },
          parameters: { size: "1280*720", watermark: true }
        })
      });

      const data = await response.json();

      if (data.output && data.output.task_id) {
        console.log("✅ Submitted! Task ID: " + data.output.task_id);
        return data.output.task_id;
      } else if (data.code === "Throttling.RateQuota") {
        console.log("⚠️  Rate limit hit. Waiting 20 seconds... (attempt " + attempt + "/" + retries + ")");
        await wait(20000);
      } else {
        console.log("❌ Submit failed: " + JSON.stringify(data));
        return null;
      }
    } catch (err) {
      console.log("❌ Error: " + err.message);
      if (attempt < retries) {
        console.log("   Retrying in 10 seconds...");
        await wait(10000);
      }
    }
  }
  return null;
}

// ── Step 2: Poll until video is ready ──
async function waitForVideo(task_id, sceneNum) {
  console.log("⏳ Waiting for video to generate...");
  var maxAttempts = 60; // 15 mins max
  for (var attempt = 1; attempt <= maxAttempts; attempt++) {
    await wait(15000); // check every 15 seconds
    try {
      const response = await fetch(TASK_URL + task_id, {
        headers: { "Authorization": "Bearer " + API_KEY }
      });
      const data = await response.json();
      const status = data.output && data.output.task_status;
      const videoUrl = data.output && data.output.video_url;

      var elapsed = attempt * 15;
      console.log("   [" + elapsed + "s] Status: " + status);

      if (status === "SUCCEEDED" && videoUrl) {
        console.log("✅ Video ready!");
        return videoUrl;
      } else if (status === "FAILED") {
        console.log("❌ Video generation failed!");
        return null;
      }
    } catch (err) {
      console.log("   Poll error: " + err.message + " — retrying...");
    }
  }
  console.log("❌ Timed out waiting for Scene " + sceneNum);
  return null;
}

// ── Step 3: Download video ──
async function downloadVideo(videoUrl, scene) {
  const filename = "Scene" + scene.scene + "_" + scene.title + ".mp4";
  const filepath = path.join(SAVE_FOLDER, filename);
  console.log("⬇️  Downloading video...");
  try {
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    const sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(2);
    console.log("✅ Downloaded! " + filename + " (" + sizeMB + " MB)");
    console.log("📁 Saved to: " + filepath);
    return filepath;
  } catch (err) {
    console.log("❌ Download failed: " + err.message);
    console.log("   Manual URL: " + videoUrl);
    return null;
  }
}

// ── Process ONE scene completely ──
async function processScene(scene) {
  // Step 1: Submit
  var task_id = await submitTask(scene);
  if (!task_id) {
    console.log("⏭️  Skipping Scene " + scene.scene + " due to submit failure.");
    return { scene: scene.scene, title: scene.title, status: "FAILED", path: null };
  }

  // Step 2: Wait for video
  var videoUrl = await waitForVideo(task_id, scene.scene);
  if (!videoUrl) {
    return { scene: scene.scene, title: scene.title, status: "FAILED", path: null };
  }

  // Step 3: Download
  var savedPath = await downloadVideo(videoUrl, scene);

  console.log("🎉 Scene " + scene.scene + " complete!\n");

  // Wait 5 seconds before next submission
  if (scene.scene < SCENES.length) {
    console.log("⏳ Waiting 5 seconds before next scene...");
    await wait(5000);
  }

  return {
    scene: scene.scene,
    title: scene.title,
    status: savedPath ? "DONE" : "DOWNLOAD_FAILED",
    path: savedPath,
    url: videoUrl
  };
}

// ── Main ──
async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("⚡ ElectroAI — Sequential Video Generator");
  console.log("   Submit → Wait → Download → Next");
  console.log("   Save folder: " + SAVE_FOLDER);
  console.log("═══════════════════════════════════════════");

  createFolder();

  var results = [];

  // Process each scene one at a time
  for (var i = 0; i < SCENES.length; i++) {
    var result = await processScene(SCENES[i]);
    results.push(result);
  }

  // Final summary
  console.log("\n═══════════════════════════════════════════");
  console.log("🎬 ALL SCENES COMPLETE — Final Summary:");
  console.log("═══════════════════════════════════════════");
  var successCount = 0;
  results.forEach(function(r) {
    if (r.status === "DONE") {
      successCount++;
      console.log("✅ Scene " + r.scene + ": " + r.title);
      console.log("   📁 " + r.path);
    } else {
      console.log("❌ Scene " + r.scene + ": " + r.title + " — " + r.status);
    }
  });

  console.log("\n🎉 " + successCount + "/" + SCENES.length + " videos downloaded to:");
  console.log("   " + SAVE_FOLDER);
  console.log("\n📽️  Open CapCut → Import all MP4s → Assemble your story!");
}

main();
