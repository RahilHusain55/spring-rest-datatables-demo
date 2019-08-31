(function($) {
	$("table").dataTable({
		dom: "<'row'<'col-sm-12 col-md-12'l>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
		ajax : {
			url : 'users',
			cache : true,
			data : function(data,settings) {
				const columns = settings.aoColumns;
				const sort = data.order.map(o=>{
						return {
						name:columns.find(c => c.idx==o.column).data,
						dir:o.dir
					};
				}).map(s=>`${s.name},${s.dir}`);
				const search={};
				data.columns.filter(c=>c.searchable).filter(c=>!!c.search.value).forEach(c=>{
					search[c.data]=c.search.value;
				});
				return {
					size : data.length,
					page : page = data.start / data.length,
					sort : sort&&sort[0],
					...search
				};
			},
			dataFilter : function(data) {
				data = JSON.parse(data);
				return JSON.stringify({
					data : data._embedded.users,
					recordsFiltered : data.page.totalElements,
					recordsTotal : data.page.totalElements,
				});
			}
		},
// searching : false,
		serverSide : true,
		processing : true,
		columns : [ {
			data : 'name'
		}, {
			data : 'email'
		}, {
			data : 'phone'
		}, {
			data : 'registrationDate'
		}, {
			data : 'country'
		}, ],
		initComplete: function() {
			this.api().columns().every(function() {
				const column = this;
				const header = $(column.header());
				if(header.hasClass('select-filter')){
					selectFilter(column);
				} else if(header.hasClass('search-filter')){
					searchFilter(column);
				} else{
					$(column.footer()).empty();
				}
			});
		}
	});
	function selectFilter(column){
		const title=column.header().textContent;
		const select = $(`<select class="form-control form-control-sm"><option value="">Select ${title}</option></select>`)
		.appendTo($(column.footer()).empty())
		.on('change', function() {
			const val = $.fn.dataTable.util.escapeRegex($(this).val());
			column.search(val ?val: '', true, false).draw();
		});
		column.data().unique().sort().each(d=>select.append(`<option value="${d}">${d}</option>`));
	}
	function searchFilter(column){
		const title=column.header().textContent;
		$(`<input type="text" class="form-control" placeholder="Search ${title}" />`)
		.appendTo($(column.footer()).empty())
		.on('keyup change', function() {
			column.search($(this).val()).draw();
		});
	}
})(jQuery);