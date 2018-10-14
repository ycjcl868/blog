---
title: 怎样写 VSCode 插件？
---
> 常说「工欲善其事，必先利其器」 ，选一个适合自己的编辑器，对提高工作效率会有较大帮助，再配上优质的编辑器插件，编码效率就像起飞了一样。

作为前端，应该鲜有不知道 VSCode 的吧。今天以 2 个示例，就和大家一起探讨一下，怎样写 VSCode 插件？

# 准备
写插件前，先用脚手架初始化项目。在命令行里运行全局安装命令

```sh
// 如果有权限问题，前面加 sudo
// 建议使用 cnpm https://npm.taobao.org/#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E 镜像进行加速
$ cnpm install -g yo generator-code
```

安装完成后，运行 `yo code` ，如果出现下面的提示，就代表脚手架安装成功了。

![image.png](https://cdn.nlark.com/lark/0/2018/png/50841/1538298295706-ac58eb9f-2208-4366-95fa-cb1faa79cc92.png)

# 一、字数统计
先来看下最终实现效果

![11111111111111.gif](https://cdn.nlark.com/lark/0/2018/gif/50841/1538528646301-d5678810-6375-4863-9ac5-322b549e4e24.gif)

## 配置阶段

首先我们创建 `wordCount` 项目：

```bash
// 用 yo 初始化项目文件，选 TypeScript 然后一路回车
$ yo code
```

然后生成这样的目录结构：

```sh
.
├── .gitignore
├── .vscodeignore // 不需要发布到插件市场的文件
├── CHANGELOG.md
├── README.md
├── package.json   // 插件的配置清单
├── out         // 编译后的代码
│   ├── extension.js
│   ├── extension.js.map
│   └── test
├── src
│   ├── extension.ts  // 插件源代码
│   └── test         // 测试用例
├── tsconfig.json   // TypeScript 配置文件
├── tslint.json
└── vsc-extension-quickstart.md  // 插件开发快速开始文档
```

### package.json
`package.json` 里包含了一些专属 VSCode 的配置，其它配置可参考[官方提供的文档](https://code.visualstudio.com/docs/extensionAPI/extension-manifest)

#### activationEvents
插件激活时机，列举几个常用的：

- `onLanguage:${language}`：特定语言类型的时候激活
- `onCommand:${command}`：用户执行命令时激活
- `workspaceContains:${toplevelfilename}`：特定文件时激活
- `*`：任何时候都激活

详情请见[官方文档](https://code.visualstudio.com/docs/extensionAPI/activation-events)

#### contributes
扩展点可以配置一些插件的 `settings.json` 属性、自定义命令、主题、菜单等，详情见[文档](https://code.visualstudio.com/docs/extensionAPI/extension-points)


根据以上，可以在 `package.json` 里修改 `activationEvents` 和 `contributes` 来分别定义插件激活的时机和执行的命令。

```diff
"activationEvents": [
-  "onCommand:extension.sayHello"
+  "onLanguage:markdown",
+  "onCommand:extension.wordCount"
],
"contributes": {
  "commands": [
    {
-    "command": "extension.sayHello",
-    "title": "Hello World"
+    "command": "extension.wordCount",
+    "title": "count Words"
    }
  ]
}
```

### extension.ts

`package.json` 和 `src/extension.ts` 是整个插件开发中最重要的两个文件，大部分的配置和功能都围绕着这两个文件进行。比如插件运行的命令我们改成了 `wordCount` ，那 `extension.ts` 里也要进行相应的注册。

```diff
'use strict';
+ // vscode 对象，提供 api
import * as vscode from 'vscode';
+ // 插件启动时执行的方法，必须导出 activate
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "wordcount" is now active!');

-    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
+    // 注册激活命令
+    let disposable = vscode.commands.registerCommand('extension.wordCount', () => {
+    // 弹出 Hello World (类似 alert)
        vscode.window.showInformationMessage('Hello World!');
    });
+   // 注册释放队列
    context.subscriptions.push(disposable);
}
+ // 插件停用/禁用时执行的方法
export function deactivate() {
}
```

可以看出插件的能力取决于 `vscode` 提供的接口和能力，API文档可以参考 [vscode 对象](https://code.visualstudio.com/docs/extensionAPI/vscode-api) 和 [vscode complex 命令](https://code.visualstudio.com/docs/extensionAPI/vscode-api-commands)

## 编码阶段
定义一个 `WordCounter` 类，并在 `activate` 函数中进行注册，用来进行字数统计。

```js
// src/extension.ts
export function activate(context : vscode.ExtensionContext) {
    console.log('Congratulations, your extension"wordcount"is now active!');

   const wordCounter = new WordCounter();

    let disposable = vscode.commands.registerCommand('extension.wordCount', () => {
        const count = wordCounter.updateWordCount();
        if (count && count >= 0) {
           vscode.window.showInformationMessage(`字数：${count}`);
       }
    });

    context.subscriptions.push(wordCounter);
    context.subscriptions.push(disposable);
}

class WordCounter {
    // VSCode 底部状态栏
    private _statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    // 释放队列
    private _disposable: vscode.Disposable;
    // subscribe event
    constructor() {
        // 注册事件
        const subscriptions: vscode.Disposable[] = [];
        // 注册光标改变事件
        vscode.window.onDidChangeTextEditorSelection(this.updateWordCount, this, subscriptions);
        // 注册切换文件事件
        vscode.window.onDidChangeActiveTextEditor(this.updateWordCount, this, subscriptions);
        // 更新状态栏
        this.updateWordCount();
        // 需要释放的事件队列
        this._disposable = vscode.Disposable.from(...subscriptions);
    }
    public updateWordCount() {

    }
    public _getWordCount(doc: vscode.TextDocument): number {

    }
    // 当插件禁用时
    dispose() {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    }
}
```

我们只需要编写 `updateWordCount` 和 `_getWordCount` 函数即可。

```js
// 获取编辑器及编辑内容的上下文
public updateWordCount() {
   // 获取当前编辑器对象
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        this._statusBarItem.hide();
        return false;
    }
   // 当前编辑对象
    const doc = editor.document;

    if (doc.languageId === 'markdown') {
        const wordCount = this._getWordCount(doc);
        this._statusBarItem.text = `${wordCount} Words`;
        this._statusBarItem.show();
        return wordCount;
    } else {
        this._statusBarItem.hide();
    }
}
// 统计函数
public _getWordCount(doc: vscode.TextDocument): number {
   // 当前编辑内容
    const docContent: string = doc.getText();
    const filterStr: string = docContent.replace(/\r\n/g, "\n");
    // 中文字数
    const chineseTotal: Array<string> = filterStr.match(/[\u4e00-\u9fa5]/g) || [];
    // 匹配单字字符
    const englishTotal: Array<string> = filterStr.match(/\b\w+\b/g) || [];
    // 匹配数字
    const letterTotal: Array<string> = filterStr.match(/\b\d+\b/g) || [];

    return (chineseTotal.length + (englishTotal.length - letterTotal.length)) || 0;
}
```

不加上测试代码，编码阶段就完成了。

## 调试阶段
快捷键直接按 `F5`  或者点 `开始调试` ，就会弹出一个新的 VSCode，debug 调试起来相当方便。

![image.png](https://cdn.nlark.com/lark/0/2018/png/50841/1538531958518-be7f8882-dc3e-47b6-8a29-f436a01db33c.png)

## 发布阶段
插件开发完、调试完后，需要发布到微软插件市场，首先我们需要一个打包发布工具 `vsce`。

```sh
// 建议使用 [淘宝npm](https://npm.taobao.org/#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E) 镜像进行加速
$ cnpm install -g vsce
```

然后再到 [Azure DevOps](https://azure.microsoft.com/services/devops/) 去注册一个帐号和组织，会得到一个 `Personal access tokens`，用  `vsce` 发布的时候填进 token 就可以了。详细步骤见[文档](https://code.visualstudio.com/docs/extensions/publish-extension)

然后运行 `vsce publish` 就可以发布成功了。

![image.png](https://cdn.nlark.com/lark/0/2018/png/50841/1538532792027-cfd3259d-c80d-4178-b4af-0a438859d31d.png)


# 二、中英文自动加空格
该插件主要是自动给中英文加空格，比如 `你好Hello` 会变成 `你好 Hello` ，效果如下：

![gif](https://user-images.githubusercontent.com/13595509/46589423-f319c100-cadb-11e8-9b15-947fa93b86c6.gif)


前面配置如上一个例子，直接看下编码阶段：
## 编码阶段
`AddSpace` 类实现加空格功能
```ts
// src/extension.ts
// 定义一个 space 类型接口
interface ISpace {
	e: vscode.TextEditor;
	d: vscode.TextDocument;
	sel: vscode.Selection[];
}

class AddSpace {
	private _disposable: vscode.Disposable;
	private _settings: vscode.WorkspaceConfiguration;
	constructor() {
		this._settings = vscode.workspace.getConfiguration('addSpace');
				// 当 settings.json 用户配置中有 addSpace.auto_space_on_save 为 ture
		let subscriptions: vscode.Disposable[] = [];
		vscode.workspace.onDidChangeConfiguration(change => {
			// 重新获取一次
			this._settings = vscode.workspace.getConfiguration('addSpace');
		});
		this._disposable = vscode.Disposable.from(...subscriptions);
	}

	private _addSpace = (space: ISpace): void => {
		const { e, d, sel } = space;
		e.edit(function (edit) {
			// 依次循环转换
			for (var x = 0; x < sel.length; x++) {
					let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
					edit.replace(sel[x], pangu.spacing(txt));
			}
		});
	}
	// 给特定选区加空格
	public addSpaceSelection = (): void => {
		let e = vscode.window.activeTextEditor;
		let d = e.document;
		let sels = e.selections;
		const space: ISpace = {
			e,
			d,
			sel: sels,
		}
		this._addSpace(space);
	}
	// 全部加空格
	public addSpaceAll = (): void => {
		let e = vscode.window.activeTextEditor;
		let d = e.document;
		let sel = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(Number.MAX_VALUE, Number.MAX_VALUE));
		const space: ISpace = {
			e,
			d,
			sel: [sel],
		}
		this._addSpace(space);
	}
	// 保存的时候，触发
	public onWillSaveDoc = (): void => {
		if (this._settings.get('auto_space_on_save')) {
			this.addSpaceAll();
		}
	}
	dispose() {
		this._disposable.dispose();
	}
}
```

`activate` 函数只做命令注册即可：

```js
export function activate(context: vscode.ExtensionContext) {
	console.log("Congratulations, your extension'addSpace'is now active!");
	const addSpace = new AddSpace();
	var add_space = vscode.commands.registerCommand('extension.add_space', addSpace.addSpaceSelection);
	var add_space_all = vscode.commands.registerCommand('extension.add_space_all', addSpace.addSpaceAll);

	const _onSaveDisposable = vscode.workspace.onWillSaveTextDocument(addSpace.onWillSaveDoc);

	context.subscriptions.push(add_space);
	context.subscriptions.push(add_space_all);
	context.subscriptions.push(addSpace);
	context.subscriptions.push(_onSaveDisposable);
}
```

具体实现参考 [ycjcl868/vscode-addSpace](https://github.com/ycjcl868/vscode-addSpace)
