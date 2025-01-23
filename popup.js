const handleFiltering = (filterTag) => {
    console.log("tags are :: ", filterTag);
    chrome.storage.local.get(['savedVideos'], (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error accessing storage:', chrome.runtime.lastError);
            return;
        }

        const savedVideos = data.savedVideos || [];

        const filteredVideos = filterTag
            ? savedVideos.filter(video => video.tag === filterTag)
            : savedVideos;

        renderSavedVideos(filteredVideos);
    });
};

const videoList = document.getElementById('video-list');
const filterList = document.getElementById('filter_section');

const renderSavedVideos = (savedVideos) => {
    videoList.innerHTML = '';
    filterList.innerHTML = ''; 

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'tags';

    const filterTitle = document.createElement('b');
    filterTitle.textContent = 'Filter tags: ';
    tagsContainer.appendChild(filterTitle);

    const filters = [
        { name: 'Educational', tag: 'educational_tag' },
        { name: 'Work', tag: 'work_tag' },
        { name: 'Entertainment', tag: 'entertainment_tag' },
        { name: 'Show All', tag: '' } 
    ];

    filters.forEach(filter => {
        const filterButton = document.createElement('div');
        filterButton.textContent = filter.name;
        filterButton.addEventListener('click', () => handleFiltering(filter.tag));
        tagsContainer.appendChild(filterButton);
    });

    filterList.appendChild(tagsContainer);

    savedVideos.forEach((video, index) => {
        const listItem = document.createElement('li');
        const videoLink = document.createElement('a');
        const thumbnail = document.createElement('img');
        const removeButton = document.createElement('button');

        const card = document.createElement("main");
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");
        const endLine = document.createElement("br");

        const tag1 = document.createElement("small");
        const tag2 = document.createElement("small");
        const tag3 = document.createElement("small");

        tag1.innerText = "Educational";
        tag2.innerText = "Work";
        tag3.innerText = "Entertainment";

        videoLink.href = video.url;
        videoLink.target = '_blank';
        let title = video.title.split(" ").slice(0, -2).join(" ");
        videoLink.textContent = title;

        thumbnail.src = video.thumbnail;

        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-btn';
        removeButton.addEventListener('click', () => {
            savedVideos.splice(index, 1);
            chrome.storage.local.set({ savedVideos }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error removing video:', chrome.runtime.lastError);
                } else {
                    renderSavedVideos(savedVideos);
                }
            });
        });

        tag1.className = "educational_tag";
        tag2.className = "work_tag";
        tag3.className = "entertainment_tag";

        let tag_name = "";
        if (video.tag !== "") {
            tag_name = video.tag;
            if (tag_name === "educational_tag") {
                tag1.style.background = "yellow";
            } else if (tag_name === "work_tag") {
                tag2.style.background = "yellow";
            } else {
                tag3.style.background = "yellow";
            }
        }

        tag1.addEventListener("click", (event) => {
            video.tag = "educational_tag";
            tag1.style.background = "yellow";
            tag2.style.background = "yellowgreen";
            tag3.style.background = "yellowgreen";
            chrome.storage.local.set({ savedVideos });
        });

        tag2.addEventListener("click", (event) => {
            video.tag = "work_tag";
            tag2.style.background = "yellow";
            tag1.style.background = "yellowgreen";
            tag3.style.background = "yellowgreen";
            chrome.storage.local.set({ savedVideos });
        });

        tag3.addEventListener("click", (event) => {
            video.tag = "entertainment_tag";
            tag3.style.background = "yellow";
            tag2.style.background = "yellowgreen";
            tag1.style.background = "yellowgreen";
            chrome.storage.local.set({ savedVideos });
        });

        div1.appendChild(thumbnail);
        div2.appendChild(videoLink);
        div2.appendChild(endLine);
        div2.appendChild(removeButton);
        div2.appendChild(tag1);
        div2.appendChild(tag2);
        div2.appendChild(tag3);

        card.appendChild(div1);
        card.appendChild(div2);

        listItem.appendChild(card);

        videoList.appendChild(listItem);
    });
};

chrome.storage.local.get(['savedVideos'], (data) => {
    if (chrome.runtime.lastError) {
        console.error('Error accessing storage:', chrome.runtime.lastError);
        return;
    }

    const savedVideos = data.savedVideos || [];
    if(savedVideos.length === 0){
        videoList.innerHTML = 
        `<center>
            <br />
            <div>No videos in the watch list</div>
            <br />
        </center>`
        return;
    }
    renderSavedVideos(savedVideos);
});
