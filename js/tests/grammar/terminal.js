var assert = chai.assert;

describe("grammar.Terminal", function () {
    var sandbox;

    beforeEach(function () {
        // create a sandbox
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        // restore the environment as it was before
        sandbox.restore();
    });

    describe("construction: Terminal", function () {

        it("check constructed type", function () {

            var t = new grammar.Terminal('myType', 'test');
            assert.isTrue(t instanceof grammar.Terminal);
            assert.isFalse(t instanceof grammar.NonTerminal);
            assert.isTrue(t instanceof grammar.Symbol);

        });

        it("check name and type properties", function () {

            var t = new grammar.Terminal('myType', 'test');
            assert.equal(t.name, 'test');
            assert.equal(t.type, 'myType');

        });

    });

    describe("construction: KeywordTerminal", function () {

        it("check type", function () {

            // keyword
            var t = new grammar.KeywordTerminal('test');
            assert.isTrue(t instanceof grammar.KeywordTerminal);
            assert.isFalse(t instanceof grammar.ValueTerminal);
            assert.isTrue(t instanceof grammar.Terminal);
            assert.isFalse(t instanceof grammar.NonTerminal);
            assert.isTrue(t instanceof grammar.Symbol);

        });

        it("check name and type property", function () {

            var t = new grammar.KeywordTerminal('test');
            assert.equal(t.name, 'test');
            assert.equal(t.type, 'KeywordTerminal');

        });

    });

    describe("construction: VariableTerminal", function () {

        it("check type", function () {

            // keyword
            var t = new grammar.VariableTerminal('test');
            assert.isTrue(t instanceof grammar.VariableTerminal);
            assert.isFalse(t instanceof grammar.KeywordTerminal);
            assert.isTrue(t instanceof grammar.Terminal);
            assert.isFalse(t instanceof grammar.NonTerminal);
            assert.isTrue(t instanceof grammar.Symbol);

        });

        it("check name and type property", function () {

            var t = new grammar.VariableTerminal('test');
            assert.equal(t.name, 'test');
            assert.notEqual(t.name, 'testtest');
            assert.equal(t.type, 'VariableTerminal');

        });

    });

    describe("construction: ValueTerminal", function () {

        it("check type", function () {

            var t = new grammar.ValueTerminal('test');
            assert.isTrue(t instanceof grammar.ValueTerminal);
            assert.isFalse(t instanceof grammar.KeywordTerminal);
            assert.isTrue(t instanceof grammar.Terminal);
            assert.isFalse(t instanceof grammar.NonTerminal);
            assert.isTrue(t instanceof grammar.Symbol);
            
        });

        it("check name and type property", function () {

            var t = new grammar.ValueTerminal('test');
            assert.equal(t.name, 'test');
            assert.equal(t.type, 'ValueTerminal');

        });

    });

});