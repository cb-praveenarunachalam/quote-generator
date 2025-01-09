import React, { useState } from 'react';
import { PlusCircle, Trash2, Quote as QuoteIcon } from 'lucide-react';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';

interface QuoteItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  billingFrequency: typeof BILLING_FREQUENCIES[number];
}

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' },
] as const;

const BILLING_FREQUENCIES = [
  { value: 'daily', label: 'Per Day' },
  { value: 'weekly', label: 'Per Week' },
  { value: 'monthly', label: 'Per Month' },
  { value: 'yearly', label: 'Per Year' },
] as const;

function CreateQuote() {
  const navigate = useNavigate();

  const [items, setItems] = useState<QuoteItem[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [currency, setCurrency] = useState<any>(CURRENCIES[0]);
  const [defaultBillingFrequency, setDefaultBillingFrequency] = useState<any>(BILLING_FREQUENCIES[0]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        billingFrequency: defaultBillingFrequency,
      },
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof QuoteItem, value: any) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-8">
          <QuoteIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Create Quote</h1>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Your Company"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Client Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              value={currency.code}
              onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Billing Frequency</label>
            <select
              value={defaultBillingFrequency.value}
              onChange={(e) => setDefaultBillingFrequency(BILLING_FREQUENCIES.find(f => f.value === e.target.value) || BILLING_FREQUENCIES[0])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {BILLING_FREQUENCIES.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={addItem}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing Frequency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      min="1"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">{currency.symbol}</span>
                      </div>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="block w-32 rounded-md border-gray-300 pl-8 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={item.billingFrequency.value}
                      onChange={(e) => updateItem(
                        item.id,
                        'billingFrequency',
                        BILLING_FREQUENCIES.find(f => f.value === e.target.value) || BILLING_FREQUENCIES[0]
                      )}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {BILLING_FREQUENCIES.map((freq) => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(item.quantity * item.unitPrice)}
                    <span className="text-xs text-gray-500 block">
                      {item.billingFrequency.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-6 py-4 text-right font-medium">
                  Total Amount:
                </td>
                <td className="px-6 py-4 text-lg font-bold text-gray-900">
                  {formatCurrency(calculateTotal())}
                  <span className="text-xs text-gray-500 block">
                    (Mixed billing frequencies)
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <Row>
          <Col style={{textAlign: 'right', marginTop: '2rem'}}>
            <Button variant='default' onClick={goBack}>Cancel</Button>
            <Button variant='primary'>Create</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default CreateQuote;