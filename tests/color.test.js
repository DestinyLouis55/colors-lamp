const fs = require("fs");
const vm = require("vm");
const path = require("path");

describe("COLORS Frontend Tests", () => {
    test("searchColor sends the correct search request", () => {
        let request;
        const elements = {
            searchText: { value: "blue" },
            colorSearchResult: { innerHTML: "" }
        };

        const paragraph = { innerHTML: "" };
        class MockXMLHttpRequest {
            open(method, url, async) {
                this.method = method;
                this.url = url;
                this.async = async;
            }
            setRequestHeader(header, value) {
                this.header = header;
                this.headerValue = value;
            }
            send(body) {
                this.body = body;
                request = this;
            }
        }

        const document = {
            getElementById: (id) => elements[id],
            getElementsByTagName: () => [paragraph]
        };

        const context = {
            document,
            XMLHttpRequest: MockXMLHttpRequest,
            window: { location: { href: "" } }
        };

        const code = fs.readFileSync(
            path.join(__dirname, "../public/js/code.js"),
            "utf8"
        );

        vm.runInNewContext(code, context);
        vm.runInContext("userId = 42; searchColor();", context);

        expect(request.method).toBe("POST");
        expect(request.url).toBe(
            "http://destinylouis.xyz/SearchColors.php"
        );
        expect(JSON.parse(request.body)).toEqual({
            search: "blue",
            userId: 42
        });
    });

    test("searchColor displays colors returned by the API", () => {
    const elements = {
        searchText: { value: "blue" },
        colorSearchResult: { innerHTML: "" }
    };

    const paragraph = { innerHTML: "" };

    class MockXMLHttpRequest {
        open() {}

        setRequestHeader() {}

        send() {
            this.status = 200;
            this.readyState = 4;
            this.responseText = JSON.stringify({
                results: ["Blue", "Dark Blue"],
                error: ""
            });

            this.onreadystatechange();
        }
    }

    const document = {
        getElementById: (id) => elements[id],
        getElementsByTagName: () => [paragraph]
    };

    const context = {
        document,
        XMLHttpRequest: MockXMLHttpRequest,
        window: { location: { href: "" } }
    };

    const code = fs.readFileSync(
        path.join(__dirname, "../public/js/code.js"),
        "utf8"
    );

    vm.runInNewContext(code, context);
    vm.runInContext('userId = 42; searchColor();', context);

    expect(elements.colorSearchResult.innerHTML).toBe(
        "Color(s) has been retrieved"
    );

    expect(paragraph.innerHTML).toBe("Blue<br />\r\nDark Blue");
    });

    test("searchColor handles no matching colors", () => {
    const elements = {
        searchText: { value: "purple" },
        colorSearchResult: { innerHTML: "" }
    };

    const paragraph = { innerHTML: "" };

    class MockXMLHttpRequest {
        open() {}

        setRequestHeader() {}

        send() {
            this.status = 200;
            this.readyState = 4;
            this.responseText = JSON.stringify({
                results: [],
                error: "No Records Found"
            });

            this.onreadystatechange();
        }
    }

    const document = {
        getElementById: (id) => elements[id],
        getElementsByTagName: () => [paragraph]
    };

    const context = {
        document,
        XMLHttpRequest: MockXMLHttpRequest,
        window: { location: { href: "" } }
    };

    const code = fs.readFileSync(
        path.join(__dirname, "../public/js/code.js"),
        "utf8"
    );

    vm.runInNewContext(code, context);
    vm.runInContext('userId = 42; searchColor();', context);

    expect(elements.colorSearchResult.innerHTML).toBe(
        "Color(s) has been retrieved"
    );

    expect(paragraph.innerHTML).toBe("");
    });
});