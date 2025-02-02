const handleFiltering = (filterTag) => {
    chrome.storage.local.get(['savedVideos'], (data) => {
        if (chrome.runtime.lastError) {
            return;
        }

        const savedVideos = data.savedVideos || [];

        const filteredVideos = filterTag
            ? savedVideos.filter(video => video.tag === filterTag)
            : savedVideos;

        renderSavedVideos(filteredVideos);
    });
};
var id;
const listContainer = document.querySelector('.link_list');
const videoList = document.getElementById('video-list');
const filterList = document.getElementById('filter_section');
const cancel_button = document.querySelector(".cancel_button");


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

        // remove button and list button
        const removeButton = document.createElement('button');
        const link_list_button = document.createElement("button");
        link_list_button.className = video.id;
        const div_for_link_and_button = document.createElement('div');

        const date_and_time = document.createElement('small');

        // links related to each video
        const link_list_section = document.querySelector(".link_section");

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

        date_and_time.innerHTML = "";
        date_and_time.style.width = "100px";
        div1.className = "video_and_time";
        link_list_button.innerHTML = "Links";


        videoLink.href = video.url;
        videoLink.target = '_blank';
        let title = video.title.split(" ").slice(0, -2).join(" ");
        videoLink.textContent = title;

        thumbnail.src = video.thumbnail;


        // on clciking of links button the links should be shown
        link_list_button.addEventListener("click", () => {
            link_list_section.style.display = "block";
            renderLinks(video.links);
            id = link_list_button.className;
        });


        // hide the links page
        cancel_button.addEventListener("click", ()=>{
            link_list_section.style.display = "none";
        })

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
            tag2.style.background = "greenyellow";
            tag3.style.background = "greenyellow";
            chrome.storage.local.set({ savedVideos });
        });

        tag2.addEventListener("click", (event) => {
            video.tag = "work_tag";
            tag2.style.background = "yellow";
            tag1.style.background = "greenyellow";
            tag3.style.background = "greenyellow";
            chrome.storage.local.set({ savedVideos });
        });

        tag3.addEventListener("click", (event) => {
            video.tag = "entertainment_tag";
            tag3.style.background = "yellow";
            tag2.style.background = "greenyellow";
            tag1.style.background = "greenyellow";
            chrome.storage.local.set({ savedVideos });
        });

        div1.appendChild(thumbnail);
        div1.appendChild(endLine);
        div1.appendChild(date_and_time);

        div_for_link_and_button.appendChild(removeButton);
        div_for_link_and_button.appendChild(link_list_button);
        div_for_link_and_button.style.cssText = `display: block; align-items: center;`

        div2.appendChild(videoLink);
        div2.appendChild(endLine);
        div2.appendChild(div_for_link_and_button);
        div2.appendChild(tag1);
        div2.appendChild(tag2);
        div2.appendChild(tag3);

        card.appendChild(div1);
        card.appendChild(div2);

        listItem.appendChild(card);

        videoList.appendChild(listItem);
    });
};

// Add event listener for icon clicks
const iconsContainer = document.querySelector('.icons');

iconsContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'I' || event.target.tagName === 'IMG') {
        const newLinkItem = document.createElement('li');
        newLinkItem.contentEditable = true; // Make the new list item editable
        newLinkItem.textContent = 'Add your link here...';

        const iconElement = event.target.cloneNode(true);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => {
            newLinkItem.contentEditable = false; 
            const linkAnchor = document.createElement('a');
            linkAnchor.href = newLinkItem.textContent;
            linkAnchor.target = '_blank';
            linkAnchor.textContent = 'Link';

            chrome.storage.local.get(['savedVideos'], (data) => {
                const savedVideos = data.savedVideos || [];
                let target_video = savedVideos.filter((video) => {
                    return video.id == id;
                })
                target_video[0].links.push({ url: newLinkItem.textContent, icon: iconElement.outerHTML });
                renderLinks(target_video[0].links);
                chrome.storage.local.set({ savedVideos });
                renderSavedVideos(savedVideos);
            });
        });

        const listContainer = document.querySelector('.link_list');
        const linkItemContainer = document.createElement('div'); 

        linkItemContainer.appendChild(iconElement);
        linkItemContainer.appendChild(newLinkItem);
        linkItemContainer.appendChild(saveButton);

        listContainer.appendChild(linkItemContainer);
    }
});

// Function to render links with icons
const renderLinks = (links) => {
    const listContainer = document.querySelector('.link_list');
    listContainer.innerHTML = ''; 
    try{
        links.forEach((link, index) => {
            const linkItem = document.createElement('li');
            const linkIconContainer = document.createElement('span');
            linkIconContainer.innerHTML = link.icon; 
            const linkAnchor = document.createElement('a');
            linkAnchor.href = link.url;
            linkAnchor.target = '_blank';
            linkAnchor.textContent = 'Link';
    
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                chrome.storage.local.get(['savedVideos'], (data) => {
                    const savedVideos = data.savedVideos || [];
                    let target_video = savedVideos.filter((video, index) => {
                        return video.id == id;
                    })
                    target_video[0].links.splice(index, 1); // Remove the specific link
                    chrome.storage.local.set({ savedVideos }, () => {
                        renderLinks(target_video[0].links);
                    });
                    renderSavedVideos(savedVideos);
                });
            });
    
            linkItem.appendChild(linkIconContainer);
            linkItem.appendChild(linkAnchor);
            linkItem.appendChild(removeButton);
    
            listContainer.appendChild(linkItem);
        });
    }
    catch(error){
    }
};


chrome.storage.local.get(['savedVideos'], (data) => {
    data.savedVideos.forEach(element => {
        console.log(element);
    });
});


chrome.storage.local.get(['savedVideos'], (data) => {
    if (chrome.runtime.lastError) {
        return;
    }

    const savedVideos = data.savedVideos || [];
    if (savedVideos.length === 0) {
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
