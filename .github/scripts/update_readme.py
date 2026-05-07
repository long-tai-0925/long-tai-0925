import json
import requests

# 設定多個資料來源
SOURCES = {
    "experiences": "https://raw.githubusercontent.com/long-tai-0925/NEW-ME/refs/heads/main/public/json/experiences.json",
    "support": "https://raw.githubusercontent.com/long-tai-0925/NEW-ME/refs/heads/main/public/json/support.json"
}

def fetch_data(url):
    return requests.get(url).json()

def render_experiences(data):
    table = "| 年份 | 項目 | 描述 | 角色 |\n| :--- | :--- | :--- | :--- |\n"
    sorted_data = sorted(data, key=lambda x: x.get('years', '0'), reverse=True)
    for exp in sorted_data:
        title = f"[{exp.get('title')}]({exp.get('link')})" if exp.get('link') else exp.get('title')
        table += f"| {exp.get('years')} | {title} | {exp.get('subtitle')} | {exp.get('role')} |\n"
    return table

def render_support(data):
    # 這裡根據你 support.json 的結構來寫渲染邏輯
    table = "| 項目 | 描述 | 說明 |\n| :--- | :--- | :--- |\n"
    for supp in data:
        table += f"| {supp.get('title')} | {supp.get('subtitle')} | {supp.get('desc')} |\n"
    return table

def update_section(readme, section_id, new_content):
    start_tag = f"<!-- START_SECTION:{section_id} -->"
    end_tag = f"<!-- END_SECTION:{section_id} -->"
    if start_tag in readme and end_tag in readme:
        header = readme.split(start_tag)[0]
        footer = readme.split(end_tag)[1]
        return f"{header}{start_tag}\n\n{new_content}\n{end_tag}{footer}"
    return readme

if __name__ == "__main__":
    with open("README.md", "r", encoding="utf-8") as f:
        readme_content = f.read()

    # 處理經歷區塊
    exp_data = fetch_data(SOURCES["experiences"])
    readme_content = update_section(readme_content, "experiences", render_experiences(exp_data))

    # 處理專案區塊 (如果檔案已存在)
    try:
        proj_data = fetch_data(SOURCES["projects"])
        readme_content = update_section(readme_content, "support", render_support(supp_data))
    except:
        print("Projects JSON 尚未就緒，跳過...")

    with open("README.md", "w", encoding="utf-8") as f:
        f.write(readme_content)
