import { giveIdTo } from "../editorOutputSynchronization";

export default class GenerateHTML {
  constructor(output, blocks) {
    this.output = output; // the "output" container
    this.initHTMLGeneration(blocks);
    this.last_paragraph_ID = 0;
    this.last_list_ID = 0;
    this.last_header_ID = 0;
    this.last_table_ID = 0;
    this.containerFromTop = this.output.getBoundingClientRect().top;
    this.initGiveIDs();
  }

  initHTMLGeneration(blocks) {
    this.output.innerHTML = ""; // making sure to clean the previous value

    const subArrayFunc = createSubArray(blocks); // the "closure" function, if I could say so...

    let subTopicWrappers = []; // array of "subTopicWraps", the "<section class="subTopicWrap">"
    blocks.forEach((block) => {
      if (block.data.level === 2) subTopicWrappers.push(subArrayFunc()); // if current block is a "h2", call the innerFunction
    });

    this.subTopicWrappersHandler(subTopicWrappers);
  }

  subTopicWrappersHandler(subTopicWrappers) {
    subTopicWrappers.forEach((wrapper) => {
      let subTopicWrapElement = document.createElement("section"); // create that <section class="subYopicWrap"> element
      subTopicWrapElement.setAttribute("class", "subTopicWrap");

      wrapper.forEach((element) => {
        subTopicWrapElement.insertAdjacentHTML(
          "beforeend",
          `${this.injectAppropriateElement(element)}`
        );
      });

      this.output.appendChild(subTopicWrapElement);
    });
  }

  injectAppropriateElement(element) {
    let willReturn = null;
    switch (element.type) {
      case "header":
        willReturn = this.headerHandler(element.data);
        break;
      case "paragraph":
        willReturn = this.paragraphHandler(element.data);
        break;
      case "list":
        willReturn = this.listHandler(element.data);
        break;
      case "table":
        willReturn = this.tableHandler(element.data);
        break;
      case "image":
        willReturn = this.imageHandler(element.data);
        break;
      case "quote":
        willReturn = this.quoteHandler(element.data);
        break;
    }
    return willReturn;
  }

  headerHandler(data) {
    switch (data.level) {
      case 2:
        return `<h2 class="subTopic output-header">${data.text}</h2>`;
      case 3:
        return `<h3 class="output-header">${data.text}</h3>`;
      case 4:
        return `<h4 class="output-header">${data.text}</h4>`;
    }
  }
  paragraphHandler(data) {
    data.text = this.replaceTags(data.text, ["b>", "i>"], ["strong>", "em>"]);

    if (/<(span)\sclass="ml?t?1?2?rem">/.test(data.text)) {
      data.text.replace(/span/g, "p");
    } else return `<p class="output-paragraph">${data.text}</p>`;

    return `<p class="output-paragraph">${data.text}</p>`;
  }
  listHandler(data) {
    let dtRegex = /^<dt class="helloStyle">[a-zA-Z\s?]+:?\s?<\/dt>/i;
    if (!dtRegex.test(data.items[0])) {
      switch (data.style) {
        case "ordered":
          return `
						<ol>
							${data.items.map((li) => `<li class="output-list-item">${li}</li>`).join("")}
						</ol>
					`;
        case "unordered":
          return `
						<ul>
							${data.items.map((li) => `<li class="output-list-item">${li}</li>`).join("")}
						</ul>
					`;
      }
      return;
    }
    let ddRegex = /<\/dt>/; // starts right after the </dt>
    let dtText = "",
      ddText = "";

    let temp = "text.substring(text.match(/</dt>/).index+5).trim();";

    return `
			<dl>
				${data.items
          .map((listItem) => {
            dtText = listItem.match(dtRegex)[0];
            dtText = dtText.replace(/helloStyle/, "descriptionTitle");
            ddText = listItem
              .substring(listItem.match(/<\/dt>/).index + 5)
              .trim();
            return `
					${dtText}
					<dd class="output-list-item">${this.replaceTags(
            ddText,
            ["b>", "i>"],
            ["strong>", "em>"]
          )}</dd>
			`;
          })
          .join("")}
			</dl>
		`;
  }
  tableHandler(data) {
    return `
			<table class="output-table">
				${data.content
          .map((row, index) => {
            return `
						<tr>
							${row
                .map((column) => {
                  if (index === 0) {
                    return `<th>${column}</th>`;
                  } else return `<td>${column}</td>`;
                })
                .join("")}
						</tr>
					`;
          })
          .join("")}
			</table>
		`;
  }

  imageHandler(data) {
    return `<img class="output-image" src="${data.url}" alt="${data.caption}">`;
  }

  quoteHandler(data) {
    return `<blockquote class="blockquoteCustomStyle" data-caption="- ${data.caption}">${data.text}</blockquote>`;
  }

  replaceTags(data, oldTags, newTags) {
    let newData;
    oldTags.forEach((oldTag, index) => {
      let regex = new RegExp(oldTag, "g");
      if (!newData) newData = data.replace(regex, newTags[index]);
      // will replace <b> with <strong>
      else newData = newData.replace(regex, newTags[index]); // will replace <i> with <em>
    });
    return newData;
  }

  initGiveIDs() {
    const blocks = [
      {
        name: "paragraph",
        selector: ".output-paragraph:not([data-block-id])",
      },
      {
        name: "list",
        selector: ".output-list-item:not([data-block-id])",
      },
      {
        name: "header",
        selector: ".output-header:not([data-block-id])",
      },
      {
        name: "table",
        selector: ".output-table:not([data-block-id])",
      },
    ];
    blocks.forEach((block) => giveIdTo.call(this, block));
  }
}

// Actually, this is my first "practical" test of "closure", LOL

function createSubArray(blocks) {
  let startFrom = 0;

  return function () {
    let subArray = [];
    console.log("started from: " + startFrom);
    for (let i = startFrom; i < blocks.length; i++) {
      if (i !== startFrom && blocks[i].data.level == 2) {
        startFrom = i;
        break;
      }
      subArray.push(blocks[i]);
    }
    // return {subArray: subArray, startFrom: startFrom};
    return subArray;
  };
}
