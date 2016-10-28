var assert = chai.assert;

describe("structures.TreeNode", function () {
    var sandbox;

    beforeEach(function () {
        // create a sandbox
        sandbox = sinon.sandbox.create();
                
    });

    afterEach(function () {
        // restore the environment as it was before
        sandbox.restore();
    });

    describe("construction: constructor, getValue", function () {
                
        it("constructed node value should agree with getter", function () {
            
            // construct node
            var t = new structures.TreeNode('test input');
            
            // test properties
            assert.equal(t.getValue(), 'test input');
            
        });        

        it("constructed node should have no children or parent set", function () {

            // construct node
            var t = new structures.TreeNode('test input');

            // test properties
            assert.isNull(t.getParent());
            assert.isArray(t.getChildren());
            assert.lengthOf(t.getChildren(), 0);

        });        

    });

    describe("parent: getParent, setParent", function () {        
        it("set parent node should accept only objects of type TreeNode", function () {

            // set up
            var t = new structures.TreeNode('test');
            var badP = { Fizz: 'Buzz' };

            // throw exception if not TreeNode
            assert.throws(function () { t.setParent(badP); }, TypeError);
            
        });        

        it("set parent node should update correctly", function () {

            // set up
            var t = new structures.TreeNode('test');
            var p = new structures.TreeNode('parent');
            
            // check parent gets set if valid
            t.setParent(p);
            assert.equal(t.getParent().getValue(), p.getValue());
            assert.isTrue(t.getParent() === p); // check reference equality
            
        });        
    });  

    describe("children: getChildren, removeChildren, addChild, hasChildren", function () {
        it("adding children should only accept objects of type TreeNode", function () {

            // set up
            var t = new structures.TreeNode('test');
            var badC = { Fizz: 'Buzz' };

            // throw exception if not TreeNode
            assert.throws(function () { t.addChild(badC); }, TypeError);

        });

        it("adding children should update correctly", function () {

            // set up
            var t = new structures.TreeNode('test');
            var c1 = new structures.TreeNode('child1');
            var c2 = new structures.TreeNode('child2');
            var c3 = new structures.TreeNode('child3');
            var c4 = new structures.TreeNode('child4');

            // add children
            t.addChild(c1);
            t.addChild(c2);
            t.addChild(c3);
            t.addChild(c4);
            // check children are an array
            assert.isArray(t.getChildren());
            assert.lengthOf(t.getChildren(), 4);
            // check child references
            assert.isTrue(t.getChildren()[0] === c1);
            assert.isTrue(t.getChildren()[1] === c2);
            assert.isTrue(t.getChildren()[2] === c3);
            assert.isTrue(t.getChildren()[3] === c4);
            // check children's parent references
            assert.isTrue(t.getChildren()[0].getParent() === t);
            assert.isTrue(t.getChildren()[1].getParent() === t);
            assert.isTrue(t.getChildren()[2].getParent() === t);
            assert.isTrue(t.getChildren()[3].getParent() === t);
        
        });

        it("hasChildren should return true iff there are children", function () {

            // set up
            var t = new structures.TreeNode('test');
            var c1 = new structures.TreeNode('child1');
            var c2 = new structures.TreeNode('child2');
            var c3 = new structures.TreeNode('child3');
            var c4 = new structures.TreeNode('child4');

            // add children
            t.addChild(c1);
            t.addChild(c2);
            t.addChild(c3);
            t.addChild(c4);
            assert.isTrue(t.hasChildren());

            // remove
            t.removeChildren();
            assert.isFalse(t.hasChildren());

        });

        it("removing all children should update correctly", function () {

            // set up
            var t = new structures.TreeNode('test');
            var c1 = new structures.TreeNode('child1');
            var c2 = new structures.TreeNode('child2');
            var c3 = new structures.TreeNode('child3');
            var c4 = new structures.TreeNode('child4');

            // check children get set
            t.addChild(c1);
            t.addChild(c2);
            t.addChild(c3);
            t.addChild(c4);
            t.removeChildren();
            assert.isArray(t.getChildren());
            assert.lengthOf(t.getChildren(), 0);

        });

    });

});