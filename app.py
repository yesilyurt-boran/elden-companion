import webview
import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from openai import OpenAI
from anthropic import Anthropic

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(BASE_DIR, "ui", "index.html")

def launch_hotkey_script():
    ahk_script = os.path.join(BASE_DIR,"elden_companion.ahk")
    os.startfile(ahk_script)

with open("saves/settings.json", "r") as f:
    settings= json.load(f)

with open("saves/apisettings.json", "r") as f:
    api_settings= json.load(f)

with open("saves/playerstate.json", "r") as f:
    state= json.load(f)

with open("data/bigbuild.json","r") as f:
    builds=json.load(f)

build_nms=[]
for build in builds:
    build_nms.append(build["Name"])

stat_sub={k: state[k] for k in ["level","build"]}

convo_hist=["no content"]

class API:
    def view(self,arg):
        print(arg)

    def get_key(self,key):
        if settings["provider"]=="Google":
            api_settings["google"]=str(key)
        elif settings["provider"]=="OpenAI":
            api_settings["openai"]=str(key)
        elif settings["provider"]=="Anthropic":
            api_settings["anthropic"]=str(key)

        with open("apisettings.json","w") as f:
            json.dump(api_settings,f)
    
    def get_provider(self,provider):
        if provider:
         settings["provider"]=provider

    def get_model(self,model):
        settings["model"]=model
    
    def get_lvl(self,lvl):
        state["level"]= str(lvl)
    
    def get_region(self,reg):
        state["region"]= reg

    def get_tone(self,tone):
        if tone == "Remembrancer":
            settings["tone"]= "Remembrancer"
            settings["role"]= "wise companion"
        elif tone == "Scion of Grace":
            settings["tone"]= "Scion of Grace"
            settings["role"]="heroic companion"
        elif tone == "Grace-Abandoned":
            settings["tone"]= "Grace-Abandoned"
            settings["role"]="discourged companion"

    def apiset_disp(self):
        apiset={"provider":settings["provider"],"model":settings["model"],"tone":settings["tone"]}
        window.evaluate_js(f"document.getElementById(\"apisetsum\").innerHTML=apisetdisp({json.dumps(apiset)})")
    
    def set_disp(self):
        set={"build":state["build"],"helpdisp":settings["help display"]}
        window.evaluate_js(f"document.getElementById(\"setsum\").innerHTML=setdisp({json.dumps(set)})")

    def get_build(self,build):
        state["build"]=build
        build_selected=0
        for bld in builds:
            if bld["Name"]==build:
                build_selected=bld
                break
        window.evaluate_js(f"document.getElementById(\"buildWindow\").innerHTML=build_generate({json.dumps(build_selected)})")
        window.evaluate_js("enableDragging()")
    
    def send_builds(self,n):
        if n=="1":
            window.evaluate_js(f"setbuilds({build_nms})")
        elif n=="2":
            window.evaluate_js(f"setbuilds2({build_nms})")

    def get_wlktrgh(self,helpdisp):
        settings["help display"]=helpdisp

    def get_progress(self,region,state):
        with open("saves/regionprogress.json","r") as f:
            regprog=json.load(f)
        regprog[region]=state
        with open("saves/regionprogress.json","w") as f:
            json.dump(regprog,f)
    
    def get_notes(self,note):
        state["notes"]=note
    def save_notes(self):
        with open("saves/playerstate.json","w") as f:
            json.dump(state,f)

    def render_progress(self):
        # Regions
        with open("saves/regionprogress.json","r") as f:
            regprogress=json.load(f)
        window.evaluate_js(f"render_prog({json.dumps(regprogress)})")
        window.evaluate_js(f"gomain('insession'); switchregion({json.dumps(state["region"])})")
        # Build
        for bld in builds:
            if bld["Name"]==state["build"]:
                current_build=bld
                break
        window.evaluate_js(f"document.getElementById(\"buildWindow\").innerHTML=build_generate({json.dumps(current_build)})")
        window.evaluate_js("enableDragging()")
        # Notes 
        window.evaluate_js(f"document.getElementById(\"notes\").value={json.dumps(state["notes"])}")
        #Toggle walktrough
        window.evaluate_js(f"document.getElementById(\"helpchoice\").value={json.dumps(settings["help display"])}")
        window.evaluate_js("walktrgh1()")
  
    def save_progress(self):
        with open("saves/settings.json","w") as f:
            json.dump(settings,f)
        with open("saves/playerstate.json","w") as f:
            json.dump(state,f)

    def get_message(self,mssg):
        prompt=f"You are an expert companion of the tarnished in Elden Ring\nYour role is {settings["role"]}\n You prefer hints, direction over direct location names\n Build and level of the tarnished are in {stat_sub}\nPast conversations in order: {convo_hist[-4:]} \nMaximum 30 words\nTarnished speaks:" + mssg

        if settings["provider"]=="Google":
           
            llm_google = ChatGoogleGenerativeAI(model=settings["model"],temperature=0.2, max_output_tokens=500, google_api_key=api_settings["google"])
            message = [HumanMessage(content=prompt)]
            ans_ggle = llm_google.invoke(message)
            convo_hist.append({"user": mssg , "tarnished": ans_ggle.content})
            script = f"getAnswer({json.dumps(ans_ggle.content)})"
            webview.windows[0].evaluate_js(script)

        elif settings["provider"]=="OpenAI":

            client=OpenAI(api_key=api_settings["openai"])
            ans_openai=client.responses.create(
                model=settings["model"],
                input=prompt,
                temperature=0.2,
                max_output_tokens=100,
            )
            convo_hist.append({"tarnished": mssg , "companion": ans_openai.output_text})
            script = f"getAnswer({json.dumps(ans_openai.output_text)})"
            webview.windows[0].evaluate_js(script)

        elif settings["provider"]=="Anthropic":
            
            client=Anthropic(api_key=api_settings["anthropic"])
            ans_claude=client.messages.create(
                model=settings["model"],
                max_tokens=100,
                temperature=0.2,
                messages=[{"role":"user","content":prompt}]
            )
            script = f"getAnswer({json.dumps(ans_claude.content[0].text)})"
            webview.windows[0].evaluate_js(script)
    def quit_app(self):
        for w in webview.windows:
            w.destroy()
api=API()

window = webview.create_window(
    title="Elden Companion",
    url=HTML,
    width=500,
    height=780,
    resizable=True,
    easy_drag=False,
    on_top=True,
    js_api=api
)

launch_hotkey_script()
webview.start()