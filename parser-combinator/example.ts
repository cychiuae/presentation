type ParseResult<T> = Success<T> | Failure;

type Success<T> = { type: "Success"; value: T; remaining: string };
type Failure = { type: "Failure"; errorMessage: string };

function Success<T>(value: T, remaining: string): Success<T> {
  return {
    type: "Success",
    value,
    remaining,
  };
}
function isSuccess<T>(r: ParseResult<T>): r is Success<T> {
  return r.type === "Success";
}

function Failure(errorMessage: string): Failure {
  return {
    type: "Failure",
    errorMessage,
  };
}
function isFailure<T>(r: ParseResult<T>): r is Failure {
  return r.type === "Failure";
}

type Parser<T> = (str: string) => ParseResult<T>;
function Parser<T>(f: Parser<T>): Parser<T> {
  return f;
}

type Char = string;

const pCharacter = (char: Char): Parser<Char> => {
  const parseCharacter = (str: string): ParseResult<Char> => {
    if (str.length === 0) {
      return Failure("Empty string");
    }
    if (str[0] === char) {
      return Success(char, str.substring(1));
    }
    return Failure(`Expecting ${char}, but got ${str[0]}`);
  };
  return Parser(parseCharacter);
};

function andThen<A, B>(parser1: Parser<A>, parser2: Parser<B>): Parser<[A, B]> {
  return Parser<[A, B]>((str) => {
    const result1 = parser1(str);
    if (isFailure(result1)) {
      return Failure(result1.errorMessage);
    }
    const { value: value1, remaining: remaining1 } = result1;

    const result2 = parser2(remaining1);
    if (isFailure(result2)) {
      return Failure(result2.errorMessage);
    }
    const { value: value2, remaining: remaining2 } = result2;
    return Success([value1, value2], remaining2);
  });
}

function orElse<A>(parser1: Parser<A>, parser2: Parser<A>): Parser<A> {
  return Parser<A>((str) => {
    const result1 = parser1(str);
    if (isSuccess(result1)) {
      return result1;
    }
    const result2 = parser2(str);
    return result2;
  });
}

function map<A, B>(fmap: (a: A) => B, parser: Parser<A>): Parser<B> {
  return Parser<B>((str) => {
    const result = parser(str);
    if (isSuccess(result)) {
      return Success(fmap(result.value), result.remaining);
    }
    return result;
  });
}

function any(chars: Char[]): Parser<Char> {
  return chars.map(pCharacter).reduce(orElse);
}

function sequence<A>(parsers: Parser<A>[]): Parser<A[]> {
  const concatResults = (p1: Parser<A[]>, p2: Parser<A[]>) => {
    let oneAndThenTwo = andThen(p1, p2);
    return map(([a, b]) => a.concat(b), oneAndThenTwo);
  };
  return parsers.map((p) => map((a) => [a], p)).reduce(concatResults);
}

function pString(str: string): Parser<string> {
  const ps = sequence(str.split("").map(pCharacter));
  return map((ss) => ss.join(""), ps);
}

function andThenTakeFirst<A, B>(
  parser1: Parser<A>,
  parser2: Parser<B>,
): Parser<A> {
  return map(([a]: [A, B]) => a, andThen(parser1, parser2));
}

function andThenTakeSecond<A, B>(
  parser1: Parser<A>,
  parser2: Parser<B>,
): Parser<B> {
  return map(([a, b]: [A, B]) => b, andThen(parser1, parser2));
}

function between<A, B, C>(
  parser1: Parser<A>,
  parser2: Parser<B>,
  parser3: Parser<C>,
): Parser<B> {
  return andThenTakeFirst(andThenTakeSecond(parser1, parser2), parser3);
}

// YYYY-MM-DD
const digit = any(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
const year = map(
  (s: string[]) => Number(s.join("")),
  sequence([digit, digit, digit, digit]),
);
const month = map(
  (s: string[]) => Number(s.join("")),
  sequence([digit, digit]),
);
const day = map((s: string[]) => Number(s.join("")), sequence([digit, digit]));
const separator = orElse(pCharacter("-"), pCharacter("/"));
const dateStringParser = map(
  ([year, month, day]: number[]) => ({
    year,
    month,
    day,
  }),
  sequence([
    andThenTakeFirst(year, separator),
    andThenTakeFirst(month, separator),
    day,
  ]),
);

function satisfy(predicate: (char: Char) => boolean): Parser<Char> {
  const parse = (str: string): ParseResult<Char> => {
    if (str.length === 0) {
      return Failure("Empty string");
    }
    if (predicate(str[0])) {
      return Success(str[0], str.substring(1));
    }
    return Failure(`${str[0]} cannot satisfy the condition`);
  };
  return Parser(parse);
}

const pCharacter2 = (char: Char) => satisfy((input) => char === input);

const anyLetter = satisfy((char) => /\w/.test(char));
const anyNumber = satisfy((char) => /\d/.test(char));

const parseIDNumber = sequence([
  anyLetter,
  anyNumber,
  anyNumber,
  anyNumber,
  anyNumber,
  anyNumber,
  anyNumber,
  between(pCharacter("("), anyNumber, pCharacter(")")),
]);
