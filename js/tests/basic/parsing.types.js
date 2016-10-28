var assert = chai.assert;

describe("basicParsing.Types", function () {

    describe("check type types and syntax symbols", function () {

        function checkTypeAndSymbol(type, typeType, symbol) {
            assert.isTrue(type instanceof typeType, "Type " + type);
            assert.isTrue(symbol === type.symbol, "Symbol " + symbol.name);
        }

        it("check value types", function () {

            checkTypeAndSymbol(basicParsing.Types.PositiveInteger, parsing.ValueType, basicSyntax.Symbols.PositiveInteger);
            checkTypeAndSymbol(basicParsing.Types.Number, parsing.ValueType, basicSyntax.Symbols.Number);
            checkTypeAndSymbol(basicParsing.Types.String, parsing.ValueType, basicSyntax.Symbols.String);
            checkTypeAndSymbol(basicParsing.Types.StringVariable, parsing.ValueType, basicSyntax.Symbols.StringVariable);
            checkTypeAndSymbol(basicParsing.Types.NumberVariable, parsing.ValueType, basicSyntax.Symbols.NumberVariable);

        });

        it("check keyword types", function () {

            // CLS, END, IF, THEN, ELSE, PRINT, INPUT, GOTO
            checkTypeAndSymbol(basicParsing.Types.KeywordCls, parsing.KeywordType, basicSyntax.Symbols.KeywordCls);
            checkTypeAndSymbol(basicParsing.Types.KeywordEnd, parsing.KeywordType, basicSyntax.Symbols.KeywordEnd);
            checkTypeAndSymbol(basicParsing.Types.KeywordIf, parsing.KeywordType, basicSyntax.Symbols.KeywordIf);
            checkTypeAndSymbol(basicParsing.Types.KeywordElseIf, parsing.KeywordType, basicSyntax.Symbols.KeywordElseIf);
            checkTypeAndSymbol(basicParsing.Types.KeywordEndIf, parsing.KeywordType, basicSyntax.Symbols.KeywordEndIf);
            checkTypeAndSymbol(basicParsing.Types.KeywordThen, parsing.KeywordType, basicSyntax.Symbols.KeywordThen);
            checkTypeAndSymbol(basicParsing.Types.KeywordElse, parsing.KeywordType, basicSyntax.Symbols.KeywordElse);
            checkTypeAndSymbol(basicParsing.Types.KeywordPrint, parsing.KeywordType, basicSyntax.Symbols.KeywordPrint);
            checkTypeAndSymbol(basicParsing.Types.KeywordInput, parsing.KeywordType, basicSyntax.Symbols.KeywordInput);
            checkTypeAndSymbol(basicParsing.Types.KeywordGoto, parsing.KeywordType, basicSyntax.Symbols.KeywordGoto);

        });

        it("check operator types", function () {

            checkTypeAndSymbol(basicParsing.Types.OperatorSemicolon, parsing.OperatorType, basicSyntax.Symbols.OperatorSemicolon);

            checkTypeAndSymbol(basicParsing.Types.OperatorAdd, parsing.OperatorType, basicSyntax.Symbols.OperatorAdd);
            checkTypeAndSymbol(basicParsing.Types.OperatorSubtract, parsing.OperatorType, basicSyntax.Symbols.OperatorSubtract);
            checkTypeAndSymbol(basicParsing.Types.OperatorMultiply, parsing.OperatorType, basicSyntax.Symbols.OperatorMultiply);
            checkTypeAndSymbol(basicParsing.Types.OperatorDivide, parsing.OperatorType, basicSyntax.Symbols.OperatorDivide);
            checkTypeAndSymbol(basicParsing.Types.OperatorModulo, parsing.OperatorType, basicSyntax.Symbols.OperatorModulo);
            checkTypeAndSymbol(basicParsing.Types.OperatorNot, parsing.OperatorType, basicSyntax.Symbols.OperatorNot);

            checkTypeAndSymbol(basicParsing.Types.OperatorEquals, parsing.OperatorType, basicSyntax.Symbols.OperatorEquals);
            checkTypeAndSymbol(basicParsing.Types.OperatorNotEquals, parsing.OperatorType, basicSyntax.Symbols.OperatorNotEquals);
            checkTypeAndSymbol(basicParsing.Types.OperatorLessThan, parsing.OperatorType, basicSyntax.Symbols.OperatorLessThan);
            checkTypeAndSymbol(basicParsing.Types.OperatorGreaterThan, parsing.OperatorType, basicSyntax.Symbols.OperatorGreaterThan);
            checkTypeAndSymbol(basicParsing.Types.OperatorLessThanOrEqual, parsing.OperatorType, basicSyntax.Symbols.OperatorLessThanOrEquals);
            checkTypeAndSymbol(basicParsing.Types.OperatorGreaterThanOrEqual, parsing.OperatorType, basicSyntax.Symbols.OperatorGreaterThanOrEquals);

        });

        it("check symbol types", function () {

            checkTypeAndSymbol(basicParsing.Types.SymbolNewLine, parsing.SymbolType, basicSyntax.Symbols.NewLine);
            checkTypeAndSymbol(basicParsing.Types.SymbolLeftBracket, parsing.SymbolType, basicSyntax.Symbols.LeftBracket);
            checkTypeAndSymbol(basicParsing.Types.SymbolRightBracket, parsing.SymbolType, basicSyntax.Symbols.RightBracket);

        });

    });
    
});
