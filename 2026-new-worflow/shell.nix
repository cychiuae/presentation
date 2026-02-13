{ pkgs ? import
    (fetchTarball {
      name = "nixpkgs-2023-11-12";
      url = "https://github.com/NixOS/nixpkgs/archive/e9e02ba9d43c306cd4bc1c4b9192e7ac7a255228.tar.gz";
      sha256 = "1kf3l45d2q5vpvkvd39qkgagp4m39yps033ssa28zij62yla58ny";
    })
    { }
}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    gotools
  ];
}
