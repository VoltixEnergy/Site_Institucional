function gerarCodigo() {
    let codigo = ""
    let vetorPossibilidades = [
        ["a", "b", "c", "d", "e", "f",
            "g", "h", "i", "j", "k", "l",
            "m", "n", "o", "p", "q", "r",
            "s", "t", "u", "v", "w", "x",
            "y", "z"],
        ["A", "B", "C", "D", "e", "F", "G", "H", "I", "J", "K",
            "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
            "W", "X", "Y", "Z"],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]]
    for (let i = 0; i < 6; i++) {
        let ternario = Math.floor(Math.random() * 3);
        if (ternario == 0) {
            codigo += vetorPossibilidades[0][Math.floor(Math.random() * 26)]
        } else if (ternario == 1) {
            codigo += vetorPossibilidades[1][Math.floor(Math.random() * 26)]
        } else {
            codigo += vetorPossibilidades[2][Math.floor(Math.random() * 10)]
        }
    }
    return codigo
}