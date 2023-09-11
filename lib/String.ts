export namespace StringUtils {
  /**
   * Captitalizes the first letter in a given string.
   */
  export const capitalizeFirstLetter = (str: string) => {
    return str[0].toUpperCase() + str.slice(1)
  }

  /**
   * Returns true if the the given character in a string is whitespace.
   *
   * @param str the string to check.
   * @param index the index of the character to check.
   */
  export const isWhitespaceCharacter = (str: string, index: number) => {
    return /\s/.test(str[index])
  }
}
