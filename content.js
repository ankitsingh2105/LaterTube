console.log("YouTube Video Saver is running...");

const addSaveButtonToTitle = () => {
    console.log("Attempting to add Save button...");
    const titleContainer = document.querySelector("#title.ytd-watch-metadata h1");

    if (titleContainer && !titleContainer.querySelector(".save-btn")) {
        console.log("Title container found. Adding Save button...");
        const saveBtn = document.createElement("button");
        saveBtn.innerText = "Save";
        saveBtn.classList.add("save-btn");
        saveBtn.style.cssText =
            "margin-left: 10px; cursor: pointer; font-weight: bolder; border-radius: 18px; background: rgba(255, 255, 255, 0.1); border: none; padding: 5px 15px; color: white;";

        titleContainer.appendChild(saveBtn);

        saveBtn.addEventListener("click", () => {
            console.log("Save button clicked.");
            const title = titleContainer.innerText.trim();
            const url = window.location.href;

            // Extract video ID for thumbnail
            const videoID = new URL(url).searchParams.get("v");
            const thumbnail = videoID
                ? `https://i.ytimg.com/vi/${videoID}/maxresdefault.jpg`
                : "";

            console.log("Saving video details:", { title, url, thumbnail });

            try {
                chrome.storage.local.get(["savedVideos"], (data) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error accessing storage:", chrome.runtime.lastError);
                        return;
                    }

                    const savedVideos = data.savedVideos || [];

                    const isAlreadySaved = savedVideos.some((video) => video.url === url);
                    if (isAlreadySaved) {
                        alert("This video is already saved.");
                        return;
                    }

                    savedVideos.push({ title, url, thumbnail });
                    chrome.storage.local.set({ savedVideos }, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error saving video:", chrome.runtime.lastError);
                        } else {
                            alert("Video saved!");
                            console.log("Video saved successfully.");
                        }
                    });
                });
            } catch (error) {
                console.error("Error in Save button logic:", error);
            }
        });
    } else if (!titleContainer) {
        console.warn("Title container not found. Retrying...");
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addSaveButtonToTitle);
} else {
    addSaveButtonToTitle();
}

const observer = new MutationObserver(() => {
    addSaveButtonToTitle();
});

observer.observe(document.body, { childList: true, subtree: true });

