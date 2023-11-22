{ pkgs ? import
    (fetchTarball {
      name = "nixpkgs-2023-11-12";
      url = "https://github.com/NixOS/nixpkgs/archive/95f221e3cb607492d4c7849368493b038afbb628.tar.gz";
      sha256 = "1f7c4kp0pl5lj0m7jnsl1gncj0py0ininsmzjjx0hi1p208rvz30";
    })
    { }
}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    gotools
  ];
}
