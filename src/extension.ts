import * as vscode from 'vscode';

async function nothing(...args) {}

let blockTypeSub = null;
let modeIndicator = null;
let currentMode = null;

function spy(k, m, v) {
	console.log(k, ' ', m, ' ', v);
	return v;
}
async function changeMode(...args) {
	const availableModes = vscode.workspace.getConfiguration('modes').get<object>('availableModes');
	const targetMode = args[0]?.mode;

	if (!targetMode) {
		const choice = await vscode.window.showQuickPick(Object.entries(availableModes).map(([key, props]) => <vscode.QuickPickItem>{
			label: props.label,
			key: key
		}));

		currentMode = choice['key'];
	} else {
		currentMode = targetMode;
	}

	let targetModeProps = availableModes[currentMode];
	if (!targetModeProps) {
		vscode.window.showErrorMessage("No modes configured");
		return;
	}

	vscode.commands.executeCommand('setContext', 'modes.current', currentMode);
	modeIndicator.text = `$(${targetModeProps.kind === 'insert'? 'edit' : 'lock'}) ${targetModeProps.label}`;
	
	if (targetModeProps.kind === 'normal' && !blockTypeSub) {
		blockTypeSub = vscode.commands.registerTextEditorCommand('type', nothing);
	} else if(targetModeProps.kind !== 'normal' && !!blockTypeSub) {
		blockTypeSub.dispose();
		blockTypeSub = null;
	}
  }
  
  function initDefaultMode() {
	const config = vscode.workspace.getConfiguration('modes');
	const defaultMode = config.get<string>('defaultMode');

	if (defaultMode) {
		changeMode({ mode: defaultMode });
	}
  }

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('modes.change', changeMode)
	);
	modeIndicator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	modeIndicator.command = "modes.change";
	modeIndicator.show();
	initDefaultMode();
}

export function deactivate() {
	blockTypeSub?.dispose();
	modeIndicator?.dispose();
}
