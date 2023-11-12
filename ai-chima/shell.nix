{ pkgs ? import
    (fetchTarball {
      name = "nixpkgs-2023-05-10";
      url = "https://github.com/NixOS/nixpkgs/archive/49b373958553f8b7fea8795b7bb4ede86057488c.tar.gz";
      sha256 = "0rxgssijv425b8bklhnnvmmbdb23x94a4ncm5f85zd33ky0vkwk6";
    })
    { }
}:
pkgs.mkShell {
  buildInputs = [
    pkgs.gotools
  ];
}
