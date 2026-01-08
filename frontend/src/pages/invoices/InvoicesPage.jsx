import { FaFileInvoice } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
function InvoicesPage() {
	const navigate = useNavigate();
	const [invoices, setInvoices] = useState([]);

	const fetchInvoices = async () => {
		try {
			const response = await api.get('/api/invoices');
			setInvoices(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchInvoices();
	}, []);

	function handleAdd() {
		navigate('/invoices/add');
	}

	const handleDelete = async (invoiceId) => {
		if (!window.confirm('Na pewno usunąć fakturę?')) {
			return;
		}
		try {
			await api.delete(`/api/invoices/${invoiceId}`);
			setInvoices(invoices.filter((inv) => inv.id !== invoiceId));
		} catch (err) {
			console.log(err);
		}
	};
	const handleDownloadPDF = async (invoiceId, invoiceNumber) => {
		try {
			console.log('Pobieram PDF dla faktury:', invoiceId);

			const response = await api.get(`/api/invoices/${invoiceId}/pdf`, {
				responseType: 'blob',
			});

			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = `faktura-${invoiceNumber}.pdf`;
			link.click();

			window.URL.revokeObjectURL(url);

			console.log('PDF pobrany!');
		} catch (err) {
			console.log(err);
			alert('Błąd pobierania PDF');
		}
	};
	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case 'paid':
			case 'opłacona':
				return 'bg-green-500';
			case 'unpaid':
			case 'nieopłacona':
				return 'bg-red-500';
			case 'partial':
			case 'częściowo':
				return 'bg-yellow-500';
			default:
				return 'bg-gray-500';
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Faktury</span>
						<span className='text-[#AEB9E1]'>Zarządzaj fakturami i płatnościami</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj fakturę
						<FaFileInvoice />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nr faktury</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Klient</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Naprawa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Kwota netto</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Podatek</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Kwota brutto</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Metoda płatności</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data wystawienia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{invoices.map((invoice) => (
								<tr key={invoice.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-medium'>{invoice.invoice_number}</td>
									<td className='px-4 py-3 text-white'>
										{invoice.klient.first_name} {invoice.klient.last_name}
									</td>
									<td className='px-4 py-3 text-white'>{invoice.repair_order ? 'Tak' : 'Brak'}</td>
									<td className='px-4 py-3 text-white'>{invoice.subtotal} zł</td>
									<td className='px-4 py-3 text-white'>{invoice.tax_amount} zł</td>
									<td className='px-4 py-3 text-white font-semibold'>{invoice.total_amount} zł</td>
									<td className='px-4 py-3 text-white'>{invoice.payment_method.name}</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
												invoice.status,
											)}`}>
											{invoice.status}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(invoice.issue_date).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDownloadPDF(invoice.id, invoice.invoice_number)}
												className='text-green-400 hover:text-green-300 transition-colors'
												title='Pobierz PDF'>
												<FaFilePdf size={20} />
											</button>
											<button
												onClick={() => handleDelete(invoice.id)}
												className='text-red-400 hover:text-red-300 transition-colors'
												title='Usuń'>
												<MdDelete size={20} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
}

export default InvoicesPage;
