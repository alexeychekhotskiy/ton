import "@stdlib/deploy";

message Add {
    amount: Int as uint32;
}

contract FirstContract with Deployable {

    id: Int as uint32;
    counter: Int as uint32;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
    }

    receive("increment") {
        self.counter = self.counter + 1;
    }

    receive(message: Add) {
        self.counter = self.counter + message.amount;
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }
}
