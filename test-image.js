// ═══════════════════════════════════════════════
// Test Character Image Generation Only
// Run: node test-image.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "PASTE_YOUR_API_KEY_HERE";
const SAVE_FOLDER = "E:\\NB\\Frames\\character\\image";

const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

function createFolder() {
  if (!fs.existsSync(SAVE_FOLDER)) {
    fs.mkdirSync(SAVE_FOLDER, { recursive: true });
    console.log("📁 Created: " + SAVE_FOLDER);
  }
}

async function testImageGeneration() {
  console.log("═══════════════════════════════════════════");
  console.log("🧪 Testing Character Image Generation");
  console.log("═══════════════════════════════════════════");

  createFolder();

  // Try Model 1: wanx2.1-t2i-turbo
  console.log("\n📤 Trying model: wanx2.1-t2i-turbo...");
  var result = await tryModel("wanx2.1-t2i-turbo");
  if (result) return;

  // Try Model 2: wanx-v1
  console.log("\n📤 Trying model: wanx-v1...");
  result = await tryModel("wanx-v1");
  if (result) return;

  // Try Model 3: wanx2.0-t2i-turbo
  console.log("\n📤 Trying model: wanx2.0-t2i-turbo...");
  result = await tryModel("wanx2.0-t2i-turbo");
  if (result) return;

  console.log("\n❌ All models failed. Check API key and account permissions.");
}

async function tryModel(modelName) {
  try {
    const response = await fetch(
      "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json",
          "X-DashScope-Async": "enable"
        },
        body: JSON.stringify({
          model: modelName,
          input: {
            prompt: "Young Southeast Asian woman, late 20s, black hair, light blue casual shirt, warm friendly face, neutral pose, white background, realistic, high quality"
          },
          parameters: {
            size: "1024*1024",
            n: 1
          }
        })
      }
    );

    const data = await response.json();
    console.log("📥 Response: " + JSON.stringify(data).substring(0, 300));

    if (data.code) {
      console.log("❌ Error code: " + data.code + " — " + data.message);
      return false;
    }

    if (data.output && data.output.task_id) {
      console.log("✅ Task submitted! ID: " + data.output.task_id);
      console.log("⏳ Polling for result...");

      // Poll for result
      for (var i = 1; i <= 30; i++) {
        await wait(5000);
        const pollRes = await fetch(TASK_URL + data.output.task_id, {
          headers: { "Authorization": "Bearer " + API_KEY }
        });
        const pollData = await pollRes.json();
        var status = pollData.output && pollData.output.task_status;
        console.log("   [" + (i*5) + "s] Status: " + status);

        if (status === "SUCCEEDED") {
          console.log("\n✅ Image generated successfully!");
          console.log("📥 Full response:");
          console.log(JSON.stringify(pollData.output, null, 2));

          // Try to download
          var results = pollData.output.results;
          if (results && results[0]) {
            var imgUrl = results[0].url || results[0].img_url;
            if (imgUrl) {
              console.log("\n⬇️  Downloading image from: " + imgUrl);
              try {
                const imgRes = await fetch(imgUrl);
                const buffer = await imgRes.arrayBuffer();
                var filepath = path.join(SAVE_FOLDER, "character_" + modelName + ".png");
                fs.writeFileSync(filepath, Buffer.from(buffer));
                var sizeKB = (buffer.byteLength / 1024).toFixed(1);
                console.log("✅ Saved: " + filepath + " (" + sizeKB + " KB)");
                return true;
              } catch (dlErr) {
                console.log("❌ Download error: " + dlErr.message);
              }
            }
          }
          return true;
        } else if (status === "FAILED") {
          console.log("❌ Model " + modelName + " failed!");
          console.log(JSON.stringify(pollData.output, null, 2));
          return false;
        }
      }
    }
    return false;
  } catch (err) {
    console.log("❌ Exception: " + err.message);
    return false;
  }
}

testImageGeneration();
