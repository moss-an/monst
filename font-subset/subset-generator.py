from pathlib import Path
import re
from bs4 import BeautifulSoup
from fontTools.subset import main as pyftsubset

ROOT_DIR = Path("/workspace")
SOURCE_FONT = ROOT_DIR / "font-subset/fonts/reggae-one-v20-japanese_latin-regular.woff2"
OUTPUT_FONT = ROOT_DIR / "public/fonts/reggae-one-subset.woff2"
TOOLS_TS = ROOT_DIR / "src/tools.ts"

# src/input.css で --font-reggae が指定されているセレクタ
TARGET_SELECTORS = ["h1", "h2", "h3", ".site-title", ".section-subtitle"]

# 走査から除外するディレクトリ
EXCLUDE_DIRS = {"dist", "node_modules", ".git", ".devcontainer"}

# 動的挿入・数値・記号・予備として含める文字
EXTRA_CHARS = "モンスト0123456789.,:：・（）()！？!?-ー〜"

def find_target_html_files(root: Path) -> list[Path]:
    html_files = []
    for path in root.rglob("index.html"):
        if any(part in EXCLUDE_DIRS for part in path.parts):
            continue
        html_files.append(path)
    return sorted(html_files)


def extract_chars_from_html(html_path: Path) -> set[str]:
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")
    chars: set[str] = set()

    for selector in TARGET_SELECTORS:
        for el in soup.select(selector):
            text = el.get_text()
            # Vueテンプレート構文 {{ ... }} を除外
            text = re.sub(r"\{\{.*?\}\}", "", text)
            text = re.sub(r"\s+", "", text)
            chars.update(text)

    # header 要素等に data-title / data-subtitle が設定されている場合にも対応
    for el in soup.select("[data-title], [data-subtitle]"):
        for attr in ("data-title", "data-subtitle"):
            val = el.get(attr)
            if isinstance(val, str):
                chars.update(re.sub(r"\s+", "", val))

    return chars


def extract_chars_from_tools_ts(tools_path: Path) -> set[str]:
    if not tools_path.exists():
        return set()
    content = tools_path.read_text(encoding="utf-8")
    # TOOLS 配列内の name: "..." / name: '...' を抽出
    names = re.findall(r'\bname\s*:\s*["\']([^"\']+)["\']', content)
    chars: set[str] = set()
    for name in names:
        chars.update(re.sub(r"\s+", "", name))
    return chars


def main() -> None:
    if not SOURCE_FONT.exists():
        raise FileNotFoundError(f"元フォントが見つかりません: {SOURCE_FONT}")

    html_files = find_target_html_files(ROOT_DIR)
    all_chars: set[str] = set(re.sub(r"\s+", "", EXTRA_CHARS))

    print("=== 対象HTMLファイルのスキャン ===")
    for html_file in html_files:
        extracted = extract_chars_from_html(html_file)
        print(f"- {html_file.relative_to(ROOT_DIR)}: {len(extracted)} 文字抽出")
        all_chars.update(extracted)

    if TOOLS_TS.exists():
        tool_chars = extract_chars_from_tools_ts(TOOLS_TS)
        print(f"- {TOOLS_TS.relative_to(ROOT_DIR)}: {len(tool_chars)} 文字抽出")
        all_chars.update(tool_chars)

    sorted_chars = "".join(sorted(all_chars))
    print(f"\n抽出された一意文字数: {len(sorted_chars)} 文字")
    print(f"文字一覧: {sorted_chars}\n")

    args = [
        str(SOURCE_FONT),
        f"--output-file={OUTPUT_FONT}",
        "--flavor=woff2",
        f"--text={sorted_chars}",
        "--layout-features=*",
        "--glyph-names",
        "--symbol-cmap",
        "--legacy-cmap",
        "--notdef-glyph",
        "--notdef-outline",
        "--recommended-glyphs",
    ]
    pyftsubset(args)

    before_kb = SOURCE_FONT.stat().st_size / 1024
    after_kb = OUTPUT_FONT.stat().st_size / 1024
    print(f"生成完了: {OUTPUT_FONT.relative_to(ROOT_DIR)}")
    print(f"サイズ変化: {before_kb:.1f} KB -> {after_kb:.1f} KB ({after_kb / before_kb * 100:.1f}%)")


if __name__ == "__main__":
    main()
