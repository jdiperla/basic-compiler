var assert = chai.assert;

describe("grammar.NonTerminal", function () {
    var sandbox;

    beforeEach(function () {
        // create a sandbox
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        // restore the environment as it was before
        sandbox.restore();
    });

    describe("construction: NonTerminal", function () {

        it("check constructed type", function () {

            var t = new grammar.NonTerminal('test');
            assert.isTrue(t instanceof grammar.NonTerminal);
            assert.isFalse(t instanceof grammar.Terminal);
            assert.isTrue(t instanceof grammar.Symbol);

        });

        it("check name property", function () {

            var t = new grammar.NonTerminal('test');
            assert.equal(t.name, 'test');

        });

    });

    describe("rules: addRule", function () {

        it("adding a non-array should throw an error", function () {

            var t = new grammar.NonTerminal('test');
            assert.throws(function () { t.addRule({ thisIs: 'notAnArray' }); }, MalformedGrammarException);
            
        });

        it("adding an array which contains non-symbols should throw an error", function () {

            var t = new grammar.NonTerminal('test');
            var rule = [new grammar.NonTerminal('ruleTest1'), new grammar.KeywordTerminal('TEST'), { thisIs: 'notASymbol' }];
            assert.throws(function () { t.addRule(rule); }, MalformedGrammarException);

        });

        it("adding an array of symbols should update rules, correctly referenced", function () {

            var t = new grammar.NonTerminal('test');
            var nt = new grammar.NonTerminal('ruleTest1');
            var ruleA = [nt, new grammar.KeywordTerminal('TEST'), new grammar.ValueTerminal('NUMBER')];
            var vt = new grammar.ValueTerminal('NUMBER');
            var ruleB = [vt];
            t.addRule(ruleA);
            t.addRule(ruleB);

            assert.isArray(t.rules, 'is array');
            assert.lengthOf(t.rules, 2, 'has correct length');
            assert.isTrue(t.rules[0][0] === nt, 'non terminal reference agrees');
            assert.equal(t.rules[1][0].name, 'NUMBER');
            assert.isTrue(t.rules[1][0] === vt, 'terminal reference agrees');

        });

    });
    
    describe("rules: isRule", function () {

        // setup
        var t = new grammar.NonTerminal('test');
        var nt = new grammar.NonTerminal('ruleTest1');
        var kt = new grammar.KeywordTerminal('TEST');
        var vt = new grammar.ValueTerminal('NUMBER');

        var ruleA = [nt, kt, vt];
        var ruleB = [vt];

        t.addRule(ruleA);
        t.addRule(ruleB);
        
        it("checking a non-array should throw an error", function () {
            
            assert.throws(function () { t.isRule({ not: 'AnArray' }); }, MalformedGrammarException);

        });

        it("checking an array which contains non-symbols should throw an error", function () {

            assert.throws(function () { t.isRule([{ not: 'AnArray' }, vt]); }, MalformedGrammarException);
    
        });

        it("checking a rule that exists should return true", function () {

            assert.isTrue(t.isRule(ruleA));
            assert.isTrue(t.isRule([nt, kt, vt]));
            assert.isTrue(t.isRule([vt]));
            
        });

        it("checking a rule that does not exists should return false", function () {

            var ruleC = [vt, vt];
            assert.isFalse(t.isRule(ruleC));
            assert.isFalse(t.isRule([]));
            assert.isFalse(t.isRule([nt]));

        });

        it("checking a rule that does not exist by reference should return false", function () {

            var nt2 = new grammar.NonTerminal('ruleTest1');
            var kt2 = new grammar.KeywordTerminal('TEST');
            var vt2 = new grammar.ValueTerminal('NUMBER');

            var ruleA2 = [nt2, kt2, vt];
            var ruleB2 = [vt2];

            assert.isFalse(t.isRule(ruleA2));
            assert.isFalse(t.isRule(ruleB2));
            
        });

    });

});