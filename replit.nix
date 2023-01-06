{ pkgs }: {
  deps = [
    pkgs.npm install
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}