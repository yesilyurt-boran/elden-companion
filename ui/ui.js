//Switching screens
function go(screenId) {
    document 
        .querySelectorAll(".screen")
        .forEach(s =>s.classList.remove("active"))
    document
        .getElementById(screenId)
        .classList.add("active")
}
function gomain(screenId) {
    document 
        .querySelectorAll(".screen")
        .forEach(s =>s.classList.remove("active"))
    document
        .getElementById(screenId)
        .classList.add("main")
}
function goback(screenId) {
    document 
        .querySelectorAll(".screen")
        .forEach(s =>s.classList.remove("main"))
    document
        .getElementById(screenId)
        .classList.add("active")
}

//handling window operations
function openwin(screenId) {
    document 
        .getElementById(screenId)
        .classList.remove("hidden")
}
function closewin(screenId) {
    document
        .getElementById(screenId)
        .classList.add("hidden")
}
let activeWin = null;
let offsetX = 0;
let offsetY = 0;

function enableDragging() {
    document.querySelectorAll(".app_window").forEach(win => {
        const header = win.querySelector(".window_header");
        if (!header) return;

        header.onmousedown = (e) => {
            activeWin = win;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        };
    });
}

document.addEventListener("mousemove", (e) => {
    if (!activeWin) return;
    activeWin.style.left = (e.clientX - offsetX) + "px";
    activeWin.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    activeWin = null;
});

//Changing Regions
function switchregion(regid) {
    document 
        .querySelectorAll(".mainpanel")
        .forEach(s =>s.classList.remove("active"))
    document
        .getElementById(regid)
        .classList.add("active")

    document
        .querySelectorAll(".walktrgh_content")
        .forEach(s =>s.classList.remove("active"))
    document
        .getElementById(regid+" "+"wlk")
        ?.parentElement
        ?.classList.add("active");
 
}

//build selector
function send_build1() {
    const build=document.getElementById("buildinput").value;
    window.pywebview.api.get_build(build);
}
function send_build2() {
    const build2=document.getElementById("buildinput2").value;
    window.pywebview.api.get_build(build2);

}
function act_bld() {window.pywebview.api.send_builds("1")}
function setbuilds(list) {
    const datalist=document.getElementById("buildoptions");
    list.forEach(
        build => {
            const option = document.createElement("option");
            option.value=build;
            datalist.appendChild(option)
        });
}
function act_bld2() {window.pywebview.api.send_builds("2")}
function setbuilds2(list) {
    const datalist=document.getElementById("buildoptions2");
    list.forEach(
        build => {
            const option = document.createElement("option");
            option.value=build;
            datalist.appendChild(option)
        });
}

function build_generate(build) {
    return ` 
            <div style="text-align: right;" class="window_header"> 
                <button class="lbutton" onclick="closewin('buildWindow')"> — </button>
            </div>
            <div style="text-align: center;" class="window_header"> 
                <h3>Build: ${build.Name}</h3>
                <a href="https://www.youtube.com/watch?v=${build.YoutubeID}" target="_blank" class="elden-link-box"> Memory fragment</a>
            </div> 
            <ul style="list-style: none; padding: 0; text-align: left;">
                ${build.Items.map(s => `<li onclick="this.classList.toggle('done')"> ${s} </li>`).join("") }
            </ul>

            <details style="overflow-y: auto;box-sizing: border-box;">
                    <summary>Guide </summary>
                        <div style="text-align: left; overflow-y: auto;box-sizing: border-box; display: flex;"> 
                            ${build.Description}
                        </div>
                </details>
        `;
};

//walktrough choice
function walktrgh1() {
    const helpdisp=document.getElementById("helpchoice").value;
    window.pywebview.api.get_wlktrgh(helpdisp);
    
    if(helpdisp === "Full Walktrough") {
        document
            .getElementById("walktrough")
            .classList.remove("hidden")
    }
}

function walktrgh2() {
    const helpdisp2=document.getElementById("helpchoice2").value;
    window.pywebview.api.get_wlktrgh(helpdisp2);
    
    if(helpdisp2 === "Full Walktrough") {
        document
            .getElementById("walktrough")
            .classList.remove("hidden")
    }
}

//Save Functions
function save() {
    
    const page = document.querySelector(".mainpanel.active")
    window.pywebview.api.get_region(page.id);
    const checkboxes = page.querySelectorAll('input[type="checkbox"]');
    const cboxval = []
    checkboxes.forEach(cbox => {cboxval.push(cbox.checked);});
    window.pywebview.api.get_progress(page.id,cboxval)

    window.pywebview.api.save_progress();    
}

function regitemsave(item) {}

function get_lvl() {
    const level = document.getElementById("lvl").value;
    window.pywebview.api.get_lvl(level);

};
////Saving the notes
const notes = document.getElementById("notes")
notes.addEventListener("input", () =>{ 
    const text = notes.value 
    window.pywebview.api.get_notes(text);
});


//Rendering the last save
function render_prog(progressave) {
    Object.entries(progressave).forEach(([region,states]) =>{ 
        const page = document.getElementById(region)
        const cboxes = page.querySelectorAll('input[type="checkbox"]');

        cboxes.forEach((cb,i) => {
            cb.checked=states[i] 
        });

    });
};
function return_session() {window.pywebview.api.render_progress()}
// API settings
const Apikey=document.getElementById("apikey");
function send_key() {
    window.pywebview.api.get_key(Apikey.value);
}
function send_tone() {
    const tonel=document.getElementById("tonelist").value;
    window.pywebview.api.get_tone(tonel);
}
const tonelook=document.getElementById("tonelist");
Apikey.addEventListener("input", function() {
    if (Apikey !== "") {
        tonelook.style.display="block";
    }
});

function apisetdisp(info) {
    return ` 
        <ul style="list-style: none; padding: 0; text-align: left;">
            <li>Provider: ${info.provider} </li>
            <li>Model: ${info.model} </li>
            <li>Tone: ${info.tone} </li>
        </ul>
    `
}

function setdisp(info) {
    return ` 
        <ul style="list-style: none; padding: 0; text-align: left;">
            <li>Build: ${info.build} </li>
            <li>Help Display: ${info.helpdisp} </li>
        </ul>
    `
}

/////////
function provider_choose() {
    const company=document.getElementById("provider").value;
    window.pywebview.api.get_provider(company);
}

function model_choose() {
    const mdl=document.getElementById("apimodel").value;
    window.pywebview.api.get_model(mdl);
}

const provider=document.getElementById("provider");
const model=document.getElementById("apimodel");

provider.addEventListener("change", function() {
        model.style.display="block";
});

//Agent Communication
const usermessage=document.getElementById("chatInput");

function sendMessage() {
    const chatbox = document.getElementById("chatMessages");
    const user_qstn = document.createElement("div");
    const qstn = usermessage.value


    user_qstn.innerText=qstn;
    user_qstn.classList.add("inputdisplay")
    chatbox.appendChild(user_qstn);

    window.pywebview.api.get_message(qstn);
    usermessage.value="";
}

function getAnswer(text) {
    const chatbox=document.getElementById("chatMessages");
    const answer=document.createElement("div");

    answer.innerText=text;
    answer.style="animation: fadeIn 0.9s ease-out;"
    chatbox.appendChild(answer);

}
//
enableDragging();

//quitting the app
const quit = document.getElementById("quit")

  quit.addEventListener("click", () => { window.pywebview.api.quit_app();
  });