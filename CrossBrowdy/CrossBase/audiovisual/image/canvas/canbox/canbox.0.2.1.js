/*
	Canbox v0.2.1
	Author: Robert Inglin
	Credit: Google's ExCanvas for _CanboxManager code
	Released Under the MIT License
*/
var slice = Array.prototype.slice;
  function bind(f, obj, var_args) {
    var a = slice.call(arguments, 2);
    return function() {
      return f.apply(obj, a.concat(slice.call(arguments)));
    };
  }

	var _CanboxManager = {
		init: function(opt_doc) {
		  if (/MSIE/.test(navigator.userAgent) && !window.opera) {
			var doc = opt_doc || document;
			// Create a dummy element so that IE will allow canvas elements to be
			// recognized.
			doc.createElement('canvas');
			if (/MSIE/.test(navigator.userAgent) && !window.opera) {
			doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
			}
			else doc.addEventListener('load', bind(this.init_, this, doc), false);

		  }
		},

		init_: function(doc) {

		  // find all canvas elements
		  var els = doc.getElementsByTagName('canvas');
		  for (var i = 0; i < els.length; i++) {
			this.initElement(els[i]);
		  }
		},

		initElement:function(_canvas){
			if(_canvas.CanBox)
				return _canvas;
			_canvas.CanBox = new CanBox();
			if(_canvas.width)
				_canvas.style.width = _canvas.width+'px';
			if(_canvas.height)
				_canvas.style.height = _canvas.height+'px';
			_canvas.style.overflow='hidden';

			var PositionDiv = document.createElement('div');
			PositionDiv.className = 'CanBoxStyles canboxItem';
			this.addStyleTag('.CanBoxStyles img{display:block;}')
			with(PositionDiv){
				style.position = 'relative';
				style.width = '100%';
				style.height = '100%';
				style.cursor = 'default';
			}
			_canvas.appendChild(PositionDiv);

			_canvas.CanBox.canvas = PositionDiv;
			_canvas.getContext = function(){
				return this.CanBox;
			}
			return _canvas;
		},
		addStyleTag:function(styleData){
			if(this.STYLETag)
				return false;

			hAppend = true;
			this.STYLETag = document.createElement('style');
			this.STYLETag.type = 'text/css';
			rules = document.createTextNode(styleData);
			if(this.STYLETag.styleSheet)
				this.STYLETag.styleSheet.cssText = rules.nodeValue;
			else this.STYLETag.appendChild(rules);
			document.getElementsByTagName("head")[0].appendChild(this.STYLETag);
		}
	}
	_CanboxManager.init();
var CanBox = function(){
	this.setIDs ='automatic';
	this.fillStyle = '#000000';
	this.strokeStyle = '#000000';
	this.lineWidth = '1';
	this.canvas = '';
	this.globalAlpha = false;
	this.canBox = this.CanBox = this.canbox = true;
	this.fontFamily = '';
	this.imageIDs = [];
	var p = {
		savestates:[],
		SetID:0,
		par:this,
		plot:[],
		paths:[],
		currentPath:0,
		plotPath:0,
		clearPaths:function(){this.paths=[];},
		namedObjects:[],//holds the ID value of the object
		objects:[],//holds all objects/containers
		createContainer:function(x,y,w,h,type){
			this.par.canvas.style.position='relative';
			var ID = (this.par.setIDs=='automatic')?this.objects.length:this.SetID;
			if(typeof(this.namedObjects[ID])!=='undefined' && this.objects[this.namedObjects[ID]]){
				this.clearContainer(this.namedObjects[ID]);
				obj = this.objects[this.namedObjects[ID]];
				e = obj.elements[0];
				e.id = this.namedObjects[ID];
				e.className = 'canboxItem';
				e.style.position = 'absolute';
				e.style.left = parseInt(x)+'px';
				e.style.top = parseInt(y)+'px';
				e.style.width = Math.abs(parseInt(w))+'px';
				e.style.height = Math.abs(parseInt(h))+'px';
			}else{
				cID = this.objects.length;
				this.namedObjects[ID] = cID;
				this.objects[cID] = {
						elements:[],
						id:cID
				}
				this.objects[cID].elements[0] = document.createElement('div');
				e = this.objects[cID].elements[0];
				e.ondragstart=function(){return false;};
				e.style.MozUserSelect="none";
				e.onselectstart=function(){return false}
				e.className = 'canboxItem';
				e.style.position = 'absolute';
				e.style.left = parseInt(x)+'px';
				e.style.top = parseInt(y)+'px';
				e.style.width = Math.abs(parseInt(w))+'px';
				e.style.height = Math.abs(parseInt(h))+'px';
				this.par.canvas.appendChild(e);
				obj = this.objects[cID];
			}
			obj.type = type;
			obj.x = x;
			obj.y = y;
			obj.width = w;
			obj.height = h;
			return obj;
		},
		clearContainer:function(cID){
			try{
			container = this.objects[cID].elements[0].childNodes;
			container[0].parentNode.removeChild(container[0])
			}catch(e){}//console.log(e,this.objects[cID],this.objects[cID].elements[0])}

			for(var i = 0,len=container.length;i<len;i++){

				container[i].parentNode.removeChild(container[i]);
			}
		},
		removeContainer:function(cID){
			this.clearContainer(cID);
			try{
			this.par.canvas.removeChild(this.objects[cID].elements[0]);
			}catch(e){};
			delete this.objects[cID];
		},
		addElement:function(ID,ele){
			nextEle = this.objects[ID].elements.length;
			this.objects[ID].elements[nextEle] = ele;
			e = this.objects[ID].elements[nextEle];
			this.objects[ID].elements[0].appendChild(e);
			return true;
		},
		createDiv:function(x,y,w,h){
			var e = document.createElement('div');
			e.className = 'canboxItem';
			e.style.position = 'absolute';
			e.style.overflow = 'hidden';
			e.style.left = parseInt(x)+'px';
			e.style.top = parseInt(y)+'px';
			if(w)
			e.style.width = parseInt(w)+'px';
			if(h)
			e.style.height = parseInt(h)+'px';
			return e;
		},
		copyImage:function(img){
			var i = new Image();
			i.type = 'image';
			i.src = img.src;
			i.style.display='block';
			i.className = 'canboxItem';
			return i;
		},
		convertColor:function(color){
			if(this.par.globalAlpha !== false )
				opacity = parseFloat(this.par.globalAlpha);
			else if(color.indexOf('a(')>=0)
				opacity = color.replace(/.*,([^\)]*)\)/,"$1");
			else
				opacity = 1;

			var args = color.replace(/.*\(([^,]*,[^,]*,[^,]*)(,|\)).*/,'$1').split(',');
			if(color.indexOf('rgb')>=0){
				var hex = this.RGBtoHex(args[0],args[1],args[2])
			}else if(color.indexOf('hsl')>=0){
				var hex = this.HSLtoHex(args[0],args[1],args[2]) || '#000000';
			}else hex = color;
			return [hex,opacity];
		},
		plotPoint:function(x,y){
			this.plot[this.plotPath][this.plot[this.plotPath].length] = [x,y];
		},
		plotArc:function(cx,cy,radius,startAngle,endAngle,anticlockwise){
			if(startAngle!=0)
				startAngle = (180*startAngle)/Math.PI;
			endAngle = (180*endAngle)/Math.PI;
			startAngle+=180;
			endAngle -=180;
			if(startAngle>360)
				startAngle-=360;
			if(endAngle<0)
				endAngle+=360;
			if(startAngle==endAngle){
				startAngle = 0;
				endAngle = 360;
				anticlockwise=true;
			}
			if(startAngle>endAngle){
				x = startAngle;
				startAngle = endAngle;
				endAngle = x;
			}
			var pv = (5 - radius * 4) / 4;
			var x = 0;
			var y = radius;
			this.dcp( cx, cy, x, y, startAngle, endAngle,anticlockwise);
			while (x <= y) {
				x++;
				if (pv < 0) {
					pv += 2 * x + 1;
				} else {
					y--;
					pv += 2 * (x - y) + 1;
				}
				this.dcp(cx, cy, x, y, startAngle, endAngle,anticlockwise);
			}
		},
		dcp:function(centerX,centerY,x,y,startAngle,endAngle,anti){

			if (x < y) {
				var angle = 180/(Math.PI*Math.atan2(y, x));
				var bool;
				bool = (90 - angle >= startAngle && 90 - angle <= endAngle);
				if((anti&&bool)||(!anti&&!bool))
					this.plotPoint(centerX - y, centerY - x);
				bool = (angle >= startAngle && angle <= endAngle)
				if((anti&&bool)||(!anti&&!bool))
					this.plotPoint(centerX - x, centerY - y);
				bool = (180 - angle >= startAngle && 180 - angle <= endAngle)
				if((anti&&bool)||(!anti&&!bool))
					this.plotPoint( centerX + x, centerY - y);
				bool = (angle + 90 >= startAngle && angle + 90 <= endAngle)
				if((anti&&bool)||(!anti&&!bool))
					this.plotPoint( centerX + y, centerY - x);
				bool = (270 - angle >= startAngle && 270 - angle <= endAngle)
				if((anti&&bool)||(!anti&&!bool))
					this.plotPoint( centerX + y, centerY + x);
				bool = (angle + 180 >= startAngle && angle + 180 <= endAngle)
				if((anti&&bool)||(!anti&&!bool))
					this.plotPoint(centerX + x, centerY + y);
				bool = (360 - angle >= startAngle && 360 - angle <= endAngle)
				if((anti&&bool)||(!anti&&!bool))
					this.plotPoint( centerX - x, centerY + y);
				bool = (angle + 270 >= startAngle && angle + 270 <= endAngle)
				if((anti&&bool)||(!anti&&!bool))
					this.plotPoint(centerX - y, centerY + x);
			}
		},
		drawLine:function(x0,x1,y0,y1){
			var steep = (Math.abs(y1 - y0) > Math.abs(x1 - x0));
			var tmp,ystep;
			this.plotPoint(x1,y1)
			if (steep){
				tmp = x0;
				x0 = y0;
				y0 = tmp;
				tmp = x1;
				x1 = y1;
				y1 = tmp;
			}
			if (x0 > x1){
				tmp = x0;
				x0 = x1;
				x1 = tmp;
				tmp = y0;
				y0 = y1;
				y1 = tmp;
			}
			deltax = x1-x0;
			deltay = Math.abs(y1-y0);
			error = deltax/2;
			var y = y0
			if (y0 < y1)
				ystep = 1;
			else
				ystep = -1;
			for (var x = x0;x<x1;x++){
				if (steep)
					this.plotPoint(y,x)
				else
					this.plotPoint(x,y)
				error = error - deltay;
				if (error < 0){
					y = y + ystep;
					error = error + deltax;
				}
			}

		},
		toHex:function(num){if(num<16){switch(num){case 10:num = 'A';break;case 11:num = 'B';break;case 12:num = 'C';break;case 13:num = 'D';break;case 14:num = 'E';break;case 15:num = 'F';break;}}else{var f = Math.floor(num/16);var s = this.toHex(num-(f*16));f = this.toHex(f);num = f+''+s;}return num;},
		RGBtoHex:function(r,g,b){r = this.toHex(r);if(!r.substr(1))r = '0' + '' + r;g = this.toHex(g);if(!g.substr(1))g= '0' + '' + g;b = this.toHex(b);if(!b.substr(1))b= '0' + '' + b;return '#' + r + '' + g + '' + b;},
		HSLtoRGB:function(H,S,L){if(H>1)H=H/360;if(S>1)S=S/100;if(L>1)L=L/100;if (S == 0){   R = L * 255;   G = L * 255;   B = L * 255;}else{   if (L<0.5)var_2 = L * (1 + S);else var_2 = (L + S) - (S * L); var_1 = 2 * L - var_2;   R = 255 * this.HueToRGB(var_1, var_2, H + (1 / 3));   G = 255 * this.HueToRGB(var_1, var_2, H);   B = 255 * this.HueToRGB(var_1, var_2, H - (1 / 3));}return {r:R,g:G,b:B};},
		HueToRGB:function(v1, v2, vH){   if (vH < 0) vH += 1;   if (vH > 1) vH -= 1;   if ((6 * vH) < 1) return (v1 + (v2 - v1) * 6 * vH);   if ((2 * vH) < 1) return (v2);   if ((3 * vH) < 2) return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);   return (v1);},
		HSLtoHex:function(H,S,L){rgb = this.HSLtoRGB(H,S,L);return this.RGBtoHex(Math.floor(rgb.r),Math.floor(rgb.g),Math.floor(rgb.b));},
		setOpacity:function(ele,opacity){
			opacity = opacity*1;
			 if (/MSIE/.test(navigator.userAgent) && !window.opera) {
				if(opacity <= 1 && opacity !== false)
					opacity = opacity*100;
				var filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + opacity +')';
				ele.style.filter = filter;
			}else{
				if(opacity > 1)
					opacity = opacity/100;
				ele.style.opacity = opacity;
			}
		},
		cutObject:function(cID,x,y,w,h){
			var obj = this.objects[cID];
			var cx = obj.x,cy = obj.y,cw = obj.width,ch = obj.height;
			var cut = [];
			if((y+h<cy)||(y>cy+ch)
					||(x+w<cx)||(x>cx+cw))
				return;
			if(cx>=x&&cw+cx<=x+w)
				xval='all';
			else if(cx<x){
				if(cx+cw>x+w){
					xval = 'center';
				}else{
					xval = 'right';
				}
			}else{
				xval = 'left';
			}
			if(cy>=y&&ch+cy<=h+y)
				yval = 'all';
			else if(cy<y){
				if(y+h>=cy+ch)
					yval = 'bottom';
				else{
					yval = 'center';
				}
			}else{
				yval = 'top';
			}
			if(yval=='center'){
				yT = [0,y-cy];
				yC = [yT[1],h];
				yB = [yT[1]+yC[1],ch-(yC[1]+yT[1])];
			}
			if(yval=='top'){
				T = [0,h-(cy-y)];
				B = [T[1],ch-T[1]];
			}
			if(yval=='bottom'){
				T = [0,y-cy];
				B = [T[1],ch-T[1]];
			}
			if(xval=='center'){
				xL = [0,x-cx];
				xC = [xL[1],w];
				xR = [xL[1]+xC[1],cw-(xC[1]+xL[1])];
			}
			if(xval=='right'){
				L = [0,x-cx];
				R = [L[1],cw-L[1]];
			}
			if(xval=='left'){
				L = [0,w-(cx-x)];
				R = [L[1],cw-L[1]];
			}
			if(xval=='all'){
				if(yval=='center'){
					rem=1;
					cut[0] = [0,yT[0],cw,yT[1]];
					cut[1] = [0,yC[0],cw,yC[1]];
					cut[2] = [0,yB[0],cw,yB[1]];
				}else{
					if(yval=='top')
						rem=0;
					else
						rem=1;
					try { cut[0] = [0,T[0],cw,T[1]]; } catch(E) { cut[0] = 0; } //CrossBrowdy Fix.
					try {cut[1] = [0,B[0],cw,B[1]]; } catch(E) { cut[1] = 0; } //CrossBrowdy Fix.
				}
			}else if(xval=='center'){
				if(yval=='all'){
					rem=1;
					cut[0] = [xL[0],0,xL[1],ch];
					cut[1] = [xC[0],0,xC[1],ch];
					cut[2] = [xR[0],0,xR[1],ch];
				}else if(yval=='center'){
					rem=4;
					//top
					cut[0] = [xL[0],yT[0],xL[1],yT[1]];
					cut[1] = [xC[0],yT[0],xC[1],yT[1]];
					cut[2] = [xR[0],yT[0],xR[1],yT[1]];
					//center
					cut[3] = [xL[0],yC[0],xL[1],yC[1]];
					cut[4] = [xC[0],yC[0],xC[1],yC[1]];
					cut[5] = [xR[0],yC[0],xR[1],yC[1]];
					//bottom
					cut[6] = [xL[0],yB[0],xL[1],yB[1]];
					cut[7] = [xC[0],yB[0],xC[1],yB[1]];
					cut[8] = [xR[0],yB[0],xR[1],yB[1]];
				}else{
					if(yval=='top')
						rem=2;
					else
						rem=3;
					cut[0] = [xL[0],T[0],xL[1],T[1]];
					cut[1] = [xL[0],B[0],xL[1],B[1]];
					cut[2] = [xC[0],T[0],xC[1],T[1]];
					cut[3] = [xC[0],B[0],xC[1],B[1]];
					cut[4] = [xR[0],T[0],xR[1],T[1]];
					cut[5] = [xR[0],B[0],xR[1],B[1]];
				}
			}else{
				if(yval=='all'){
					if(xval=='left')
						rem=0;
					else
						rem=1;
					cut[0] = [L[0],0,L[1],ch];
					cut[1] = [R[0],0,R[1],ch];
				}else if(yval=='center'){
					if(xval=='left')
						rem=2;
					else
						rem=3;
					cut[0] = [L[0],yT[0],L[1],yT[1]];
					cut[1] = [R[0],yT[0],R[1],yT[1]];
					cut[2] = [L[0],yC[0],L[1],yC[1]];
					cut[3] = [R[0],yC[0],R[1],yC[1]];
					cut[4] = [L[0],yB[0],L[1],yB[1]];
					cut[5] = [R[0],yB[0],R[1],yB[1]];
				}else{
					if(xval=='left'){
						if(yval=='top')
							rem=0;
						else
							rem=2;
					}else{
						if(yval=='top')
							rem=1;
						else
							rem=3;
					}
					cut[0] = [L[0],T[0],L[1],T[1]];
					cut[1] = [R[0],T[0],R[1],T[1]];
					cut[2] = [L[0],B[0],L[1],B[1]];
					cut[3] = [R[0],B[0],R[1],B[1]];

				}
			}
			return [rem,cut];
		},
		cutImage:function(img,x,y,w,h,x2,y2,w2,h2){
			var imgHolder = this.createDiv(0,0,(w2)?w2:w,(h2)?h2:h);
			imgHolder.style.position = 'relative';
			if(typeof(x2) === 'undefined'){
				img.style.width = w + 'px';
				img.style.height = h + 'px';
			}else{
				imgHolder.style.overflow = 'hidden';
				var wratio = w2/w;
				var hratio = h2/h;
				x *= wratio;

				imgw = wratio*img.width;

				y *= hratio;
				imgh = hratio*img.height;
				img.style.top = -1*y +'px';
				img.style.left = -1*x +'px';
				img.style.width = imgw +'px';
				img.style.height = imgh +'px' ;
				img.style.position = 'absolute';
				img.style.display ='block';

			}
			imgHolder.img = img;
			imgHolder.appendChild(img);
			return imgHolder;
		}
	}
	this.save = function(){
		p.savestates[p.savestates.length] = {
			font:this.font,
			fillstyle:this.fillStyle,
			strokestyle:this.strokwStyle,
			linewidth:this.lineWidth,
			globalalpha:this.globalAlpha
		}
	},
	this.restore = function(){
		if(!p.savestates.length)
			return false;
		var savestate = p.savestates[p.savestates.length-1];
		this.fillStyle = savestate.fillstyle;
		this.strokeStyle = savestate.strokstyle;
		this.lineWidth = savestate.linewidth;
		this.globalAlpha = savestate.globalalpha;
		this.font = savestate.font;
		p.savestates = p.savestates.slice(0,-1);

	}
	this.fillRect = function(x,y,w,h,container){
		if(container){
			c = container;
			var rect = p.createDiv(x,y,w,h);
		}else{
			c = p.createContainer(x,y,w,h,'rect');
			var rect = p.createDiv(0,0,w,h);
		}

		var colorOpacity = p.convertColor(this.fillStyle);
		if(colorOpacity[1]!=1){
			p.setOpacity(rect,colorOpacity[1]);
		}
		rect.style.backgroundColor = colorOpacity[0];
		c.fillStyle=colorOpacity[0];
		c.opacity=colorOpacity[1];
		p.addElement(c.id,rect);
	}
	this.strokeRect = function(x,y,w,h,container){
		var lineWidth = parseInt(this.lineWidth);
		if(container){
			c = container;
			var rect = p.createDiv(x-1,y-1,w,h);
		}else{
			c = p.createContainer(x-1,y-1,w,h,'rect');
			var rect = p.createDiv(0,0,w,h);
		}
		var rect = p.createDiv(-lineWidth/2,-lineWidth/2,w-lineWidth*3,h-lineWidth*3);
		if(!this.strokeStyle)this.strokeStyle = this.fillStyle;
		var colorOpacity = p.convertColor(this.strokeStyle);
		if(colorOpacity[1]!=1){
			p.setOpacity(rect,colorOpacity[1]);
		}
		rect.style.bgColor = '';
		rect.style.borderColor = colorOpacity[0];
		rect.style.borderStyle = 'solid';
		rect.style.borderWidth = parseInt(this.lineWidth) + 'px';
		if (/MSIE/.test(navigator.userAgent) && !window.opera) {
			rect.style.width = parseInt(rect.style.width) + this.lineWidth*2;
			rect.style.height = parseInt(rect.style.height) + this.lineWidth*2;
		}
		c.strokeStyle=colorOpacity[0];
		c.opacity=colorOpacity[1];
		p.addElement(c.id,rect);
	}
	this.drawImage = function(image,x,y,w,h,x2,y2,w2,h2){
		if(!this.imageIDs[p.SetID]){
			this.imageIDs[p.SetID] = [];
		}
		if(!this.imageIDs[p.SetID][image.src] || (/MSIE/.test(navigator.userAgent) && !window.opera)){
			this.imageIDs[p.SetID][image.src] = p.copyImage(image);
		}
		var img = this.imageIDs[p.SetID][image.src];
		img.style.top = 0;
		img.style.left = 0;
		//image;//p.copyImage(image);
		img.ondragstart=function(){return false;};
		img.style.MozUserSelect="none";
		img.onselectstart=function(){return false}
		if(!w)
			w = parseInt(img.width);
		if(!h)
			h = parseInt(img.height);
		if(typeof(x2) === 'undefined'){
			c = p.createContainer(x,y,w,h,'image');
			c.imageInfo = {
				image:image,
				x:x,
				y:y,
				w:w,
				h:h,
				ix:0,
				iy:0,
				iw:img.width,
				ih:img.height
			}
		}else{
			c = p.createContainer(x2,y2,w2,h2,'image');
			c.imageInfo = {
				image:image,
				x:x2,
				y:y2,
				w:w2,
				h:h2,
				ix:x,
				iy:y,
				iw:w,
				ih:h
			}
		}
		var imgHolder = p.cutImage(img,x,y,w,h,x2,y2,w2,h2);
		var colorOpacity = p.convertColor('');
		if(colorOpacity[1]!=1){
			p.setOpacity(imgHolder,colorOpacity[1]);
		}
		if(this.flip){
			if(this.flip == 'hv'){
				img.style.filter ='progid:DXImageTransform.Microsoft.BasicImage(rotation=2)';
			}else if(this.flip == 'h'){
				img.style.filter = 'fliph';
			}else
				img.style.filter = 'flipv';
			this.flip = false;
		}else{
			img.style.filter = '';
		}
		p.addElement(c.id,imgHolder);
	}
	this.beginPath = function(){
		p.paths = [];
	}
	this.moveTo = function(x,y){
		p.currentPath = p.paths.length;
		p.paths[p.currentPath] = [];
		p.moveBool = true;
		p.paths[p.currentPath][p.paths[p.currentPath].length] = [x,y];
	}
	this.lineTo = function(x,y){
		p.moveBool = false;
		p.paths[p.currentPath][p.paths[p.currentPath].length] = [x,y];
	}
	this.closePath = function(){
		p.paths[p.currentPath][p.paths[p.currentPath].length] = p.paths[p.currentPath][0];
	}
	this.fill = function(){
		this.closePath();
		this.stroke();
	}
	this.stroke = function(){
		c = p.createContainer(0,0,0,0,'points');
		var minx = undefined,maxx = 0,miny=undefined,maxy=0;

		if(p.paths.length>0){
			for(var i = 0,len = p.paths.length;i<len;i++){

				p.plotPath = i;
				p.plot[p.plotPath] = [];
				//if(!p.paths)
				for(var j = 0,len2 = p.paths[i].length;j<len2;j++){
					if(j != len2-1){
						if(p.paths[i][j][0] !='arc'){
							var x0 = p.paths[i][j][0];
							var y0 = p.paths[i][j][1];
						}else{
							var x0 = p.paths[i][j][1]+p.paths[i][j][3];
							var y0 = p.paths[i][j][2];
						}
						if(p.paths[i][j+1][0] !='arc'){
							var x1 = p.paths[i][j+1][0];
							var y1 = p.paths[i][j+1][1];
						}else{
							var x1 = p.paths[i][j+1][1]+p.paths[i][j+1][3];
							var y1 = p.paths[i][j+1][2];
						}
						p.drawLine(x0,x1,y0,y1);
					}
					if(p.paths[i][j][0] =='arc'){
						//p.parc();
						p.plotArc(p.paths[i][j][1],p.paths[i][j][2],p.paths[i][j][3],p.paths[i][j][4],p.paths[i][j][5],p.paths[i][j][6]);
					}
				}
			}
			for(var i = 0,len = p.plot.length;i<len;i++){
				for(var j =0,len2 = p.plot[i].length;j<len2;j++){
					if(typeof(minx)=='undefined'||p.plot[i][j][0]<minx)
						minx =p.plot[i][j][0];
					if(p.plot[i][j][0]>maxx)
						maxx = p.plot[i][j][0];
					if(typeof(miny)=='undefined'||p.plot[i][j][1]<minx)
						miny =p.plot[i][j][1];
					if(p.plot[i][j][1]>maxy)
						maxy = p.plot[i][j][1];
					this.fillRect(p.plot[i][j][0],p.plot[i][j][1],this.lineWidth,this.lineWidth,c);
				}
			}
		}
		c.x = minx;
		c.y = miny;
		c.width = (maxx-minx);
		c.height = (maxy-miny);
		p.clearPaths();
		p.currentPath = 0;
		p.plotPath = 0;
	}
	this.arc =function(x0,y0,radius,startAngle,endAngle,anticlockwise){
		if(!p.paths[p.currentPath])
			p.paths[p.currentPath] = [];
		var len = p.paths[p.currentPath].length;
		//calculate start and end position
		if(startAngle == 0){
			sx = x0+radius;//radius*Math.cos(startAngle)
			sy = y0;
		}
		p.paths[p.currentPath][(p.moveBool == true)?len-1:len] = ['arc', x0, y0,radius, startAngle,endAngle, (anticlockwise)?true:false];
	}
	this.clearRect = function(x,y,w,h){

		for(var i =0,len = p.objects.length;i<len;i++){
			if(typeof(p.objects[i])==='undefined')
				continue;
			var cx = p.objects[i].x;
			var cy = p.objects[i].y;
			var cw = p.objects[i].width;
			var ch = p.objects[i].height;
			//subtract 1 pixel from w/h because width & height need to include first pixel
			//(ex.clearRect(0,0,100,100) should clear x0-99&y0-99 because thats 100 pixels)
			//w--;
			//h--;
			//cw--;
			//ch--;
			if((y+h<cy)||(y>cy+ch)
				||(x+w<cx)||(x>cx+cw))
				continue;
			var obj = p.objects[i];
			switch(obj.type){
				case 'points':
					for(var j=1,len2=obj.elements.length;j<len2;j++){

						var cx = parseInt(obj.elements[j].style.left);
						var cy = parseInt(obj.elements[j].style.top);
						var cw = parseInt(obj.elements[j].style.width);
						var ch = parseInt(obj.elements[j].style.height);
						if((y+h<cy)||(y>cy+ch)
							||(x+w<cx)||(x>cx+cw))
							continue;

						obj.elements[0].removeChild(obj.elements[j]);

					}
				break;
				case 'image':
					if((cx==x&&cw+cx>=x+w&&cy==y&&ch+cy>=h+y)||
						(cx<x&&cw+cx>=x+w&&cy<=y&&ch+cy>=h+y)){
						p.removeContainer(obj.id);
					}else{
						var cutinfo = p.cutObject(obj.id,x,y,w+1,h+1);
						var cuts = cutinfo[1];
						var remove = cutinfo[0];
						p.removeContainer(obj.id);
						var o = obj.imageInfo;
						for(var j=0,len2=cuts.length;j<len2;j++){
							if(j==remove)
								continue;
							if(o.w==o.iw&&o.h==o.ih)
								this.drawImage(o.image,o.ix+cuts[j][0],o.iy+cuts[j][1],cuts[j][2],cuts[j][3],obj.x+cuts[j][0],obj.y+cuts[j][1],cuts[j][2],cuts[j][3])
							else{
								var wr = (o.iw/o.w);
								var hr = (o.ih/o.h);
								var icx = o.ix+wr*cuts[j][0];
								var icy = o.iy+hr*cuts[j][1];
								var icw = wr*cuts[j][2];
								var ich = hr*cuts[j][3];
								this.drawImage(o.image,icx,icy,icw,ich,obj.x+cuts[j][0],obj.y+cuts[j][1],cuts[j][2],cuts[j][3])
							}
						}
					}
				break;
				case 'rect':
					if(cx>=x&&cw+cx<=x+w&&cy>=y&&ch+cy<=h+y){
						p.removeContainer(obj.id);
					}else{
						var tmpfill = this.fillStyle;
						var tmpstroke = this.strokeStyle;
						var tmpline = this.lineWidth;
						var tmpalpha = this.globalAlpha;
						this.globalAlpha = false;
						if(obj.fillStyle)
							this.fillStyle = obj.fillStyle;
						if(obj.strokeStyle)
							this.strokeStyle =obj.strokeStyle;
						if(typeof(obj.opacity)!=='undefined')
							this.globalAlpha = parseFloat(obj.opacity);
						var cutinfo = p.cutObject(obj.id,x,y,w,h);
						var cuts = cutinfo[1];
						var remove = cutinfo[0];
						p.removeContainer(obj.id);

						for(var j=0,len2=cuts.length;j<len2;j++){
							if(j==remove)
								continue;
							if(obj.fillStyle){
								this.fillRect(cuts[j][0]+obj.x,cuts[j][1]+obj.y,cuts[j][2],cuts[j][3]);
							}else{
								this.strokeRect(cuts[j][0]+obj.x,cuts[j][1]+obj.y,cuts[j][2],cuts[j][3]);
							}
						}
					}
				break;
				default:

			}
		}
	}
	this.measureText = function(text,hbool){
		if (/MSIE/.test(navigator.userAgent) && !window.opera) {
			if(!this.font){
				this.font = "10px Arial";
			}
			if(isNaN(parseInt(this.font.substring(0,1)))){
				this.font = "10px " + this.font
			}
		}
		 measure = document.createElement('span');
		document.body.appendChild(measure);
		measure.innerHTML = text;
		measure.style.font = this.font;
		measure.style.color = this.fillStyle;
		var width = measure.offsetWidth + 1;
		var height = measure.offsetHeight -3;
		document.body.removeChild(measure);
		return {width:width,height:height};
	}
	this.fillText = function(text,x,y){
		var textbox = p.createContainer(x,y-this.measureText(text).height,this.measureText(text).width,this.measureText(text).height,'text');
		textbox.elements[0].innerHTML = text;
		textbox.elements[0].style.font = this.font;
		textbox.elements[0].style.color = this.fillStyle;
		var colorOpacity = p.convertColor(this.fillStyle);
		p.setOpacity(textbox.elements[0],colorOpacity[1]);
	}
	this.strokeText = function(text,x,y){
		var tmpfill  = this.fillStyle
		this.fillStyle = this.strokeStyle;
		this.fillText(text,x,y);
		this.fillStyle = tmpfill;
	}
	this.clearCanvas = function(){
		for(var i = 0,len=p.objects.length;i<len;i++){
			if(typeof(p.objects[i])==='undefined')
				continue;
			p.removeContainer(i);
		}
	}
	this.setID = function(ID){

		p.SetID = ID;
		if(!p.namedObjects[ID]){
			p.createContainer(0,0,0,0,'blank');
		}
	}
	this.setZindex = function(z){
		var ID = p.SetID;
		if(p.namedObjects[ID]!==false){
			p.objects[p.namedObjects[ID]].elements[0].style.zIndex = z;
		}
	}
	this.moveContainer = function(ID,x,y){
		p.objects[p.namedObjects[ID]].elements[0].style.top = y + 'px';
		p.objects[p.namedObjects[ID]].elements[0].style.left = x + 'px';
	}
	this.deleteContainer =  function(ID){
		p.removeContainer(p.namedObjects[ID])
	}
	this.flipImage = function(type){
		this.flip = type;
	}
}