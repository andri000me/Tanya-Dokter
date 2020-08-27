$(document).ready(function(){
	$('.sidenav')
		.sidenav()
		.on('click tap', 'li a', () => {
			$('.sidenav').sidenav('close');
		});
	$('.scrollspy').scrollSpy();
	$('.tooltipped').tooltip();
    $('.parallax').parallax();
	$('select').formSelect();
	
	getGejala();
	
	$(".article").slice(0, 3).show();
	
	$(window).on('scroll', function() {
		let docHeight = $(document).height(),
			winHeight = $(window).height();
	
		let viewport = docHeight - winHeight,
			positionY = $(window).scrollTop();
	
		let indicator = ( positionY / (viewport)) * 100;
	
		$('.progress-bar').css('width', indicator + '%');
		
		if (indicator > 5) {
			$('nav').addClass('scrolled');
			$('nav').removeClass('p-3');
			$('#masuk').removeClass('pulse');
			$('nav').css('box-shadow', '');
			$('.progress-container').css('display', '');
		}
		else {
			$('nav').removeClass('scrolled');
			$('nav').addClass('p-3');
			$('#masuk').addClass('pulse');
			$('nav').css('box-shadow', 'none');
			$('.progress-container').css('display', 'none');
		}
	});
	
	$("#tampil").on("click", function(e){
		e.preventDefault();
		$(".article:hidden").slice(0, 3).slideDown();
		if($(".article:hidden").length == 0) {
			$("#tampil").hide();
		}
	});
	
	let current_fs, next_fs, previous_fs; //fieldsets
	let left, opacity, scale; //fieldset properties which we will animate
	let animating; //flag to prevent quick multi-click glitches
	
	$(".next").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		next_fs = $(this).parent().next();
		
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		
		//show the next fieldset
		next_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'transform': 'scale('+scale+')', 'position': 'absolute' });
				next_fs.css({'left': left, 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});
	
	$(".previous").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();
		
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left });
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				previous_fs.css({ 'position': 'relative' });
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});
	
	$("#gejala_dominan").change(function(){
		
		let gejala_dominan	= $(this).val();
		
		if(gejala_dominan) {
			let gelaja_resesif 	= "";
			
			$.ajax({
				url: "./ajax_call.php",
				type: "POST",
				data : {"gejala_dominan":gejala_dominan, "kode":1},
				dataType: "json",
				success:function(data) {
					
					if(data.length !== 0) {
						if(data.length > 1) {
							
							let x;
							if(data.length > 2) {
								x = 3;
							}
							else {
								x = 2;
							}
							
							for(i=0; i<x; i++) {
								gelaja_resesif += 	`
														<div class="input-field col m6 s12 offset-m3 mt-2 mb-0">
															<label>Apakah anak Anda mengalami gejala <strong>`+ data[i]['nama_gejala'] +`</strong> juga?</label>
															<p class="mt-5 left-align">
																<label class="mr-5">
																	<input type="radio" class="validate with-gap" name="gejala_resesif[`+ [i] +`]" value="`+ data[i]['kode_gejala'] +`">
																	<span>Ya</span>
																</label>
																<label>
																	<input type="radio" class="validate with-gap" name="gejala_resesif[`+ [i] +`]" value="">
																	<span>Tidak</span>
																</label>
															</p>
														</div>
													`;
							}
						}
						else {
							gelaja_resesif += 	`
													<div class="input-field col m6 s12 offset-m3 mt-2 mb-0">
														<label>Apakah anak Anda mengalami gejala <strong>`+ data[0]['nama_gejala'] +`</strong> juga?</label>
														<p class="mt-5 left-align">
															<label class="mr-5">
																<input type="radio" class="validate with-gap" name="gejala_resesif" value="`+ data[0]['kode_gejala'] +`">
																<span>Ya</span>
															</label>
															<label>
																<input type="radio" class="validate with-gap" name="gejala_resesif" value="">
																<span>Tidak</span>
															</label>
														</p>
													</div>
												`;
						}
					}
										
					$('#gejala_resesif').html(gelaja_resesif);
				},
				error:function(x) {
					console.log(x.responseText);
				}
			});
		}
	});
	
	$(".submit").click(function(){
		
		if($("#gejala_dominan").val().length === 0) {
			
			console.log("VALIDASI DULU");
			
			return false;
		}
		else {
			let nama = document.forms["msform"]["nama_pasien"].value;
			let usia = document.forms["msform"]["usia_pasien"].value;
			let gejala_dominan = $("#gejala_dominan").val();
			let gejala_resesif = document.forms["msform"]["gejala_resesif[0]"].value;
			let gejala_resesif2 = document.forms["msform"]["gejala_resesif[1]"].value;
			let gejala_resesif3 = document.forms["msform"]["gejala_resesif[2]"].value;
			
			let hasil_pemeriksaan 	= "";
			
			$.ajax({
				url: "./ajax_call.php",
				type: "POST",
				data : {"gejala_dominan":gejala_dominan, "gejala_resesif":gejala_resesif, "gejala_resesif2":gejala_resesif2, "gejala_resesif3":gejala_resesif3, "kode":2},
				dataType: "json",
				success:function(data) {
					
					if(data.length !== 0) {
							hasil_pemeriksaan += 	`
														<div class="col m12 s12">
															<p class="light-text">Hasil pemeriksaan oleh sistem menunjukan bahwa: Ananda <strong>` + nama + `(` + usia + `)</strong></p>
														</div>
														<div class="col m3 s12 offset-m2">
															<h5 class="py-2">` + (data[0]['cf_hasil']*100).toFixed(2) + `%</h5>
														</div>
														<div class="col m5 s12">
															<p class="light-text left-align">Dinyatakan positif terkena penyakit <strong>` + data[0]['nama_penyakit'] + `</strong>.</p>
														</div>
													`;
					}
					else {
						console.log(x.responseText);
					}
					
					$('#hasil_pemeriksaan').html(hasil_pemeriksaan);
				},
				error:function(x) {
					console.log(x.responseText);
				}
			});
			
			if(animating) return false;
			animating = true;
			
			current_fs = $(this).parent();
			next_fs = $(this).parent().next();
			
			//activate next step on progressbar using the index of next_fs
			$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
			
			//show the next fieldset
			next_fs.show(); 
			//hide the current fieldset with style
			current_fs.animate({opacity: 0}, {
				step: function(now, mx) {
					//as the opacity of current_fs reduces to 0 - stored in "now"
					//1. scale current_fs down to 80%
					scale = 1 - (1 - now) * 0.2;
					//2. bring next_fs from the right(50%)
					left = (now * 50)+"%";
					//3. increase opacity of next_fs to 1 as it moves in
					opacity = 1 - now;
					current_fs.css({'transform': 'scale('+scale+')', 'position': 'absolute' });
					next_fs.css({'left': left, 'opacity': opacity});
				}, 
				duration: 800, 
				complete: function(){
					current_fs.hide();
					animating = false;
				}, 
				//this comes from the custom easing plugin
				easing: 'easeInOutBack'
			});
			
			return false;
		}
	})
});

function getGejala() {
	let gejala 	= "<option disabled selected>Gelaja yang dominan</option>";
	
	$.ajax({
		url: "./ajax_call.php",
		type: "POST",
		data : {"kode":0},
		dataType: "json",
		success:function(data) {
			
			let result;
			if(data.length > 0) {
				for(i=0; i<data.length; i++) {
					
					gejala	+= `<option value='` + data[i][0] + `'>` + data[i][1] + `</option>`;
				}
			}
			else {
				gejala	= `<option disabled selected>Database kosong!</option>`;
			}
			
			$('#gejala_dominan').html(gejala);
			$('select').formSelect();
		},
		error:function(x) {
			console.log(x.responseText);
		}
	});
}