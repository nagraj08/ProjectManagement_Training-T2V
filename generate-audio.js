// ═══════════════════════════════════════════════
// ElectroAI — Voiceover Generator
// Uses qwen3-tts-flash via DashScope International
// Run: node generate-audio.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "sk-8416cebc565f4a29859985e269834580";
const TTS_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const SAVE_FOLDER = "E:\\NB\\Frames\\audio";

const SCENES = [
  {
    scene: 1,
    title: "Worried_Customer",
    voice: "Serena",
    script: "Hey, we have all been there. You ordered something online, and now? Total silence. No updates. No idea where your package is. Frustrating, right?"
  },
  {
    scene: 2,
    title: "Lost_Package_Warehouse",
    voice: "Serena",
    script: "Somewhere out there, your package is lost in a sea of boxes. The staff are overwhelmed, the system is outdated. And nobody has an answer for you. There has to be a better way."
  },
  {
    scene: 3,
    title: "Opens_ElectroAI_Chatbot",
    voice: "Serena",
    script: "That is exactly why we built ElectroAI. Just open the app, type your question, and our AI assistant TechBot is ready for you. Instantly. No waiting. No hold music."
  },
  {
    scene: 4,
    title: "TechBot_Finds_Order",
    voice: "Serena",
    script: "In seconds, TechBot finds your order, tracks your package in real time, and gives you all the answers you need. In your language, on your terms."
  },
  {
    scene: 5,
    title: "Package_Arrives",
    voice: "Serena",
    script: "And just like that, problem solved! Your package arrives, right on time. No stress, no confusion. Just a smooth, happy shopping experience."
  },
  {
    scene: 6,
    title: "ElectroAI_Logo_Closing",
    voice: "Ethan",
    script: "ElectroAI. Your smart electronics companion. Powered by Qwen AI on Alibaba Cloud. Because great technology should feel this easy. Try it today."
  }
];

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

function createFolder() {
  if (!fs.existsSync(SAVE_FOLDER)) {
    fs.mkdirSync(SAVE_FOLDER, { recursive: true });
    console.log("📁 Created folder: " + SAVE_FOLDER);
  }
}

async function generateVoiceover(scene) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎙️  SCENE " + scene.scene + ": " + scene.title);
  console.log("🔊 Voice: " + scene.voice);
  console.log("📝 Script: " + scene.script.substring(0, 60) + "...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  var retries = 3;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log("📤 Sending request (attempt " + attempt + ")...");

      const response = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json",
          "X-DashScope-DataInspection": "enable"
        },
        body: JSON.stringify({
          model: "qwen3-tts-flash",
          input: {
            text: scene.script,
            voice: scene.voice
          }
        })
      });

      const data = await response.json();
      console.log("📥 Response received");

      // Handle rate limit
      if (data.code === "Throttling.RateQuota") {
        console.log("⚠️  Rate limit. Waiting 20s... (attempt " + attempt + "/" + retries + ")");
        await wait(20000);
        continue;
      }

      // Try to extract audio — check multiple response formats
      var audioData = null;
      var audioUrl = null;

      // Format 1: output.audio.data (base64)
      if (data.output && data.output.audio && data.output.audio.data) {
        audioData = data.output.audio.data;
        console.log("✅ Got audio data (base64 format)");
      }
      // Format 2: output.audio.url
      else if (data.output && data.output.audio && data.output.audio.url) {
        audioUrl = data.output.audio.url;
        console.log("✅ Got audio URL: " + audioUrl);
      }
      // Format 3: output.choices[0].message.content[].audio
      else if (data.output && data.output.choices) {
        var choice = data.output.choices[0];
        if (choice && choice.message && choice.message.content) {
          for (var i = 0; i < choice.message.content.length; i++) {
            if (choice.message.content[i].audio) {
              audioData = choice.message.content[i].audio;
              console.log("✅ Got audio (choices format)");
              break;
            }
          }
        }
      } else {
        console.log("❌ Unexpected response format:");
        console.log(JSON.stringify(data).substring(0, 300));
        return { scene: scene.scene, title: scene.title, status: "FAILED" };
      }

      // Save audio
      var filename = "Scene" + scene.scene + "_" + scene.title + "_voiceover.mp3";
      var filepath = path.join(SAVE_FOLDER, filename);

      if (audioData) {
        // Save base64 audio
        var buffer = Buffer.from(audioData, "base64");
        fs.writeFileSync(filepath, buffer);
        var sizekB = (buffer.length / 1024).toFixed(1);
        console.log("✅ Saved: " + filename + " (" + sizekB + " kB)");
        console.log("📁 Path: " + filepath);
        return { scene: scene.scene, title: scene.title, status: "DONE", path: filepath };

      } else if (audioUrl) {
        // Download from URL
        console.log("⬇️  Downloading from URL...");
        const audioResponse = await fetch(audioUrl);
        const buffer = await audioResponse.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        var sizekB2 = (buffer.byteLength / 1024).toFixed(1);
        console.log("✅ Saved: " + filename + " (" + sizekB2 + " kB)");
        console.log("📁 Path: " + filepath);
        return { scene: scene.scene, title: scene.title, status: "DONE", path: filepath };
      }

    } catch (err) {
      console.log("❌ Error: " + err.message);
      if (attempt < retries) {
        console.log("   Retrying in 10 seconds...");
        await wait(10000);
      }
    }
  }

  return { scene: scene.scene, title: scene.title, status: "FAILED" };
}

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("⚡ ElectroAI — Voiceover Generator");
  console.log("   Model: qwen3-tts-flash");
  console.log("   Voices: Serena (scenes 1-5), Ethan (scene 6)");
  console.log("   Save folder: " + SAVE_FOLDER);
  console.log("═══════════════════════════════════════════");

  createFolder();

  var results = [];

  for (var i = 0; i < SCENES.length; i++) {
    var result = await generateVoiceover(SCENES[i]);
    results.push(result);
    if (i < SCENES.length - 1) {
      console.log("\n⏳ Waiting 5 seconds before next scene...");
      await wait(5000);
    }
  }

  // Final summary
  console.log("\n═══════════════════════════════════════════");
  console.log("🎙️  VOICEOVER GENERATION COMPLETE!");
  console.log("═══════════════════════════════════════════");
  var successCount = 0;
  results.forEach(function(r) {
    if (r.status === "DONE") {
      successCount++;
      console.log("✅ Scene " + r.scene + ": " + r.title);
      console.log("   📁 " + r.path);
    } else {
      console.log("❌ Scene " + r.scene + ": " + r.title + " — FAILED");
    }
  });

  console.log("\n🎉 " + successCount + "/6 voiceovers saved to: " + SAVE_FOLDER);
  console.log("\n📽️  Next steps in CapCut:");
  console.log("   1. Import all 6 video MP4 files from E:\\NB\\Frames\\videos\\");
  console.log("   2. Import all 6 voiceover MP3 files from E:\\NB\\Frames\\audio\\");
  console.log("   3. Drag each MP3 under its matching video scene");
  console.log("   4. Add background music from CapCut audio library");
  console.log("   5. Export final video!");
}

main();
