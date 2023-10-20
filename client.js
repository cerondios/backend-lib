const Lib = require("./index")

const app = new Lib()

app.router.get("/", (req, res) => {
    console.log(req.headers)
    res.end("hello world")

})
app.router.get("/:id", (req, res) => {
    console.log(req.params.id)
    res.end()
})

console.log(app.router);

app.listen(3000)