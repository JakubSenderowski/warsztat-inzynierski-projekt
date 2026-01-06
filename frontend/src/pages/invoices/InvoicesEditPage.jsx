import Layout from '../../components/Layout';
import { IoIosSave } from 'react-icons/io';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function InvoiceEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [repairs, setRepairs] = useState([]);
	const [clients, setClients] = useState([]);
	const [paymentMethods, setPaymentMethods] = useState([]);

	const [selectedRepairId, setSelectedRepairId] = useState('');
	const [selectedClientId, setSelectedClientId] = useState('');
	const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');

	const [formData, setFormData] = useState({
		invoice_number: '',
		issue_date: '',
		due_date: '',
		subtotal: '',
		tax_amount: '',
		status: '',
		notes: '',
	});

	// Auto-calculate total
	const [totalAmount, setTotalAmount] = useState(0);

	useEffect(() => {
		const subtotal = parseFloat(formData.subtotal) || 0;
		const tax = parseFloat(formData.tax_amount) || 0;
		setTotalAmount((subtotal + tax).toFixed(2));
	}, [formData.subtotal, formData.tax_amount]);

	useEffect(() => {
		const fetchInvoice = async () => {
			try {
				const response = await api.get(`/api/invoices/${id}`);
				const invoice = response.data;

				setSelectedRepairId(invoice.repair_order_id || '');
				setSelectedClientId(invoice.klient_id);
				setSelectedPaymentMethodId(invoice.payment_method_id);

				let issueDateFormatted = '';
				if (invoice.issue_date) {
					issueDateFormatted = new Date(invoice.issue_date).toISOString().split('T')[0];
				}

				let dueDateFormatted = '';
				if (invoice.due_date) {
					dueDateFormatted = new Date(invoice.due_date).toISOString().split('T')[0];
				}

				setFormData({
					invoice_number: invoice.invoice_number,
					issue_date: issueDateFormatted,
					due_date: dueDateFormatted,
					subtotal: invoice.subtotal.toString(),
					tax_amount: invoice.tax_amount.toString(),
					status: invoice.status,
					notes: invoice.notes || '',
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (id) {
			fetchInvoice();
		}
	}, [id]);

	useEffect(() => {
		const fetchRepairs = async () => {
			try {
				const response = await api.get('/api/repair-orders');
				setRepairs(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchRepairs();
	}, []);

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const response = await api.get('/api/users');
				setClients(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchClients();
	}, []);

	useEffect(() => {
		const fetchPaymentMethods = async () => {
			try {
				const response = await api.get('/api/payment-methods');
				setPaymentMethods(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchPaymentMethods();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				invoice_number: formData.invoice_number,
				repair_order_id: selectedRepairId || null,
				klient_id: selectedClientId,
				payment_method_id: selectedPaymentMethodId,
				issue_date: formData.issue_date,
				due_date: formData.due_date || null,
				subtotal: parseFloat(formData.subtotal),
				tax_amount: parseFloat(formData.tax_amount),
				total_amount: parseFloat(totalAmount),
				status: formData.status,
				notes: formData.notes || null,
			};

			await api.put(`/api/invoices/${id}`, data);
			navigate('/invoices');
		} catch (err) {
			console.log(err);
			console.log('ERROR RESPONSE:', err.response?.data);
		}
	};

	return (
		<Layout>
			<div className='flex justify-center items-start min-h-screen px-6 pt-12'>
				<div className='bg-[#101935] rounded-xl p-8 w-full max-w-[800px]'>
					<div className='mb-8 text-center'>
						<h1 className='text-2xl text-white font-medium'>Edytuj fakturę</h1>
						<p className='text-sm text-white/60 mt-1'>Zaktualizuj dane faktury</p>
					</div>

					<form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='md:col-span-2'>
							<label className='block text-sm text-white/70 mb-1'>Numer faktury *</label>
							<input
								name='invoice_number'
								value={formData.invoice_number}
								onChange={handleInputChange}
								type='text'
								required
								placeholder='FV/2025/001'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Klient *</label>
							<select
								value={selectedClientId}
								onChange={(e) => setSelectedClientId(e.target.value)}
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz klienta</option>
								{clients.map((client) => (
									<option key={client.id} value={client.id}>
										{client.first_name} {client.last_name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Naprawa (opcjonalnie)</label>
							<select
								value={selectedRepairId}
								onChange={(e) => setSelectedRepairId(e.target.value)}
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Brak powiązania</option>
								{repairs.map((repair) => (
									<option key={repair.id} value={repair.id}>
										{repair.vehicle.model.brand.name} {repair.vehicle.model.name} (
										{repair.vehicle.registration_number})
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Metoda płatności *</label>
							<select
								value={selectedPaymentMethodId}
								onChange={(e) => setSelectedPaymentMethodId(e.target.value)}
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz metodę</option>
								{paymentMethods.map((method) => (
									<option key={method.id} value={method.id}>
										{method.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Status *</label>
							<select
								name='status'
								value={formData.status}
								onChange={handleInputChange}
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value='Nieopłacona'>Nieopłacona</option>
								<option value='Opłacona'>Opłacona</option>
								<option value='Częściowo'>Częściowo opłacona</option>
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Data wystawienia *</label>
							<input
								name='issue_date'
								value={formData.issue_date}
								onChange={handleInputChange}
								type='date'
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Termin płatności</label>
							<input
								name='due_date'
								value={formData.due_date}
								onChange={handleInputChange}
								type='date'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Kwota netto *</label>
							<input
								name='subtotal'
								value={formData.subtotal}
								onChange={handleInputChange}
								type='number'
								step='0.01'
								required
								placeholder='0.00'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Podatek (VAT) *</label>
							<input
								name='tax_amount'
								value={formData.tax_amount}
								onChange={handleInputChange}
								type='number'
								step='0.01'
								required
								placeholder='0.00'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Kwota brutto (auto)</label>
							<input
								type='text'
								value={`${totalAmount} zł`}
								disabled
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white/60 cursor-not-allowed'
							/>
						</div>

						<div className='md:col-span-2'>
							<label className='block text-sm text-white/70 mb-1'>Notatki</label>
							<textarea
								name='notes'
								value={formData.notes}
								onChange={handleInputChange}
								rows='3'
								placeholder='Dodatkowe informacje...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<button
							type='submit'
							className='md:col-span-2 w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Zapisz zmiany <IoIosSave size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default InvoiceEditPage;
