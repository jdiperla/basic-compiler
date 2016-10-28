(function (context) {

    context.TreeNode = function (value) {
        this.value = value;
        this.children = [];
        this.parent = null;
    }
    context.TreeNode.prototype.getValue = function () {
        return this.value;
    }
    context.TreeNode.prototype.setParent = function (node) {
        if (!(node instanceof structures.TreeNode)) {
            throw new TypeError("Parent node must have type TreeNode");
        }
        this.parent = node;
    }

    context.TreeNode.prototype.getParent = function () {
        return this.parent;
    }

    context.TreeNode.prototype.addChild = function (node) {
        if (!(node instanceof structures.TreeNode)) {
            throw new TypeError("Child node must have type TreeNode");
        }
        node.setParent(this);
        this.children[this.children.length] = node;
    }

    context.TreeNode.prototype.getChildren = function () {
        return this.children;
    }

    context.TreeNode.prototype.hasChildren = function () {
        return this.children.length > 0;
    }

    context.TreeNode.prototype.removeChildren = function () {
        this.children = [];
    }

})(structures); 