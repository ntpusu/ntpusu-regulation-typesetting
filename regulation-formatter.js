/* use UTF-8 */

function formatLaw() {
    
	// 法規標題、最近異動日期、詳細沿革
	
	const inputTitle = document.getElementById('lawTitleInput').value;
	const inputLastModified = document.getElementById('lawLMInput').value;
	const lastModifiedType = inputLastModified.split('日期：')[0];
	const lastModifiedZhDate = inputLastModified.split('日期：')[1];
    document.getElementById('lawTitlePrint').innerHTML = inputTitle;
    document.getElementById('lawLMPrint').innerHTML = inputLastModified;
	
	const inputHist = document.getElementById('lawHistoryInput').value;
	let outputHist = '<!-- History --> <div class="ts-header">沿革</div><div class="ts-content"><div class="ts-list is-ordered">\n';
	let copiedHist = '<!-- History -->\n<h3><strong>沿革<strong></h3>\n<ol>\n';
	if(inputHist !== null && inputHist !== '') {
		const histLines = inputHist.split('\n');
		histLines.forEach(histLine => {
			outputHist += `\t<div class="item">\n\t\t${histLine}\n\t</div>\n`;
            copiedHist += `\t<li>\n\t\t${histLine}\n\t</li>\n`;
		});
	}
	outputHist += '</div></div> <!-- end history --> \n';
    copiedHist += '</ol> <!-- end History --> \n';
	document.getElementById('lawHistoryPreview').innerHTML = outputHist;
    
	// 法規內容
	// the div class name "jfpc" means "just-for-paragraph-count"
	
	const inputText = document.getElementById('lawTextInput').value;
    const lines = inputText.split('\n');
    let outputHtml = '<p><strong>法規全稱：</strong>'+inputTitle+'</p>\n<p><strong>'+lastModifiedType+'日期：</strong>'+lastModifiedZhDate+'</p>\n\n<div class="regulation-content">\n';
    let inTiao = false;

    lines.forEach(line => {
        
		// Checking for a full-width space
		if (line.startsWith('　')) {  
            
			// Replace the first full-width space with ⊕
			line = '⊕' + line.slice(1);
		}
		
		line = line.trim();
		
		
		// 章節標題
        if (/^第[一二三四五六七八九十百千萬零]+[編章節款項目]/.test(line)) {
            if (inTiao) {
                outputHtml += '\t</div>\n\t<!-- end 條 -->\n';
                inTiao = false;
            }
            const headingClass = {
                '編': 'law-division',
                '章': 'law-chapter',
                '節': 'law-section',
                '款': 'law-hsubsection',
                '項': 'law-hxiang',
                '目': 'law-hitem'
            };
            const headingType = line.match(/第[一二三四五六七八九十百千萬零]+([編章節款項目])/)[1];
            outputHtml += `\t<div class="zhangJie">\n\t\t<p class="${headingClass[headingType]}">${line}</p>\n\t</div>\n`;
        }
        // 條號
        else if (/^第\s*\d+\s*條/.test(line) || /^第[一二三四五六七八九十百]+條/.test(line)) {
            if (inTiao) {
                outputHtml += '\t</div>\n';
            }
            let [tiaoTitle, ...rest] = line.split('（');
            tiaoTitle = tiaoTitle.trim();
            let title = rest.length ? '（' + rest.join('（') : '';
            outputHtml += `\t<div class="law-article">\n\t\t<div class="jfpc"><p class="law-art-num">${tiaoTitle}${title}</p></div>\n`;
            inTiao = true;
        }
        // 項
		else if (/^⊕/.test(line)) {
            line = line.slice(1);
			outputHtml += `\t\t<p class="xiang">${line}</p>\n`;
        }
        // 款
        else if (/^[一二三四五六七八九十]+、/.test(line)) {
            outputHtml += `\t\t<div class="jfpc"><p class="kuan">${line}</p></div>\n`;
        }
        // 目
        else if (/^（[一二三四五六七八九十]+）/.test(line)) {
            outputHtml += `\t\t<div class="jfpc"><p class="mu">${line}</p></div>\n`;
        }
        // 條文結束
        else {
            outputHtml += `\t\t${line}\n`;
        }
    }); //end foreach line

    if (inTiao) {
        outputHtml += '\t</div>\n\t<!--end single article-->\n';
    }
	
    outputHtml += '</div> <!-- end regulation content --> \n';

    document.getElementById('lawCodeShow').value = outputHtml+copiedHist;
    document.getElementById('lawResultPreview').innerHTML = outputHtml;
}

function copySourceCode() {
  // Get the text field
  var copyText = document.getElementById("lawCodeShow");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);
  
  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}