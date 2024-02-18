class Form {
    type; title; detail; beginDt; endDt; questionCount; status; maxRespondent; logoUrl; themeUrl; question;
    constructor(type, title, detail, beginDt, endDt, logUrl, themeUrl, question, status, maxRespondent) {
        this.type = type; this.title= title; this.detail = detail; this.beginDt = beginDt; this.endDt = endDt; this.logoUrl = logUrl; this.themeUrl = themeUrl; this.question = question;
        this.questionCount = question ? question.length : 0; this.maxRespondent = maxRespondent; this.status = status
    }
}

class Question {
    type; order; title; placeholder; imageUrl; detail; exampleDetail; count; answer; file;
    constructor(type, count, order, title, placeholder, detail, exampleDetail, answer, file) {
        this.type = type; this.count = count; this.order = order; this.title = title; this.placeholder = placeholder; this.detail = detail; this.exampleDetail = exampleDetail; this.answer = answer; this.file = file;
    }
}

class List { page; type; status; order; constructor(p, t, s, o) { this.page = p; this.type = t; this.status = s; this.order = o; } }

class Paper {
    fid;
    type;
    key;

    constructor(fid, type, key) {
        this.fid = fid;
        this.type = type;
        this.key = key;
    }
}