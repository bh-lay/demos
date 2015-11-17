(function(){
	var tpl = __inline('tpl.html'),
		branch = 'gh-pages';
	function getUrl(){
		var href = location.href,
			matchs = href.match(/\/\/([^\.]+).github\.io\/([^\/]+)(.+)/),
			path;
		if(!matchs){
			return '#';
		}
		path = matchs[3].replace(/(\/)[^\/]+$/,'$1');
		return 'https://github.com/' + matchs[1] + '/' + matchs[2] + '/blob/gh-pages' + path;
	}
	function buildNode(){
		var url = getUrl(),node,body;
		node = document.createElement('div'),
		body = document.getElementsByTagName('body')[0];
		node.innerHTML = tpl.replace('{link}', url); 
		body.appendChild(node);
	}
	buildNode();
})();