import * as vscode from "vscode";
import { GitExtension, Repository } from "./api/git";
import {getVermoji} from "./EmojiCommit/EmojiCommit";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.VermojiCommt",
    (sourceControl?) => {
      const git = getGitExtension();

      if (!git) {
        vscode.window.showErrorMessage("Unable to load Git Extension");
        return;
      }

      const emoji = getVermoji();

      vscode.commands.executeCommand("workbench.view.scm");

      if (sourceControl) {
        let selectedRepository = git.repositories.find((repository) => {
          return repository.rootUri.path === (sourceControl.rootUri || sourceControl._rootUri).path;
        });
        if (selectedRepository) {
          prefixCommit(selectedRepository, emoji);
        }
      } else {
        for (let repo of git.repositories) {
          prefixCommit(repo, emoji);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

function prefixCommit(repository: Repository, prefix: String) {
  repository.inputBox.value = `${repository.inputBox.value}${prefix}`;
}

function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
  const gitExtension = vscodeGit && vscodeGit.exports;
  return gitExtension && gitExtension.getAPI(1);
}

export function deactivate() {}
