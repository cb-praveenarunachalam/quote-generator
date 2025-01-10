import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Quote as QuoteIcon } from 'lucide-react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import groupBy from 'lodash.groupby';
import { format } from 'date-fns';
import generatorService from '../services/generator-service';

interface QuoteItem {
  id: number;
  dateTo: number;
  dateFrom: number;
  currencyCode?: string;
  name: string;
  quantity: number;
  price: number;
  billingFrequency: string;
}

const CURRENCIES = [
  'USD',
  'EUR',
  'INR'
] as const;

const BILLING_FREQUENCIES = [
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Half-yearly', label: 'Half-yearly' },
  { value: 'Yearly', label: 'Yearly' },
] as const;

function CreateQuote() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { quote } = state || {};

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [items, setItems] = useState<QuoteItem[]>(quote?.items ?? []);
  const [companyName, setCompanyName] = useState(quote?.companyName ?? '');
  const [customerName, setCustomerName] = useState(quote?.customerName ?? '');
  const [currency, setCurrency] = useState<string>(CURRENCIES[0]);
  const [defaultBillingFrequency, setDefaultBillingFrequency] = useState<string>(items[0]?.billingFrequency || BILLING_FREQUENCIES[0].value);
  const [quoteSummary, setQuoteSummary] = useState<string>(quote?.explanation?.replaceAll('\\\\n', '\n'));
  const [groupedItems, setGroupedItems] = useState<Record<string, any>>({});

  useEffect(() => {
    const groupedEntries = groupBy(items, (item) => {
      return `${convertTimestampToDate(item.dateFrom)} to ${convertTimestampToDate(item.dateTo)}`;
    });

    setGroupedItems(groupedEntries);
  }, [items]);

  const addItem = (item: QuoteItem) => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: '',
        dateFrom: item.dateFrom,
        dateTo:  item.dateTo,
        quantity: 1,
        price: 0,
        billingFrequency: defaultBillingFrequency,
      },
    ]);
  };

  const removeItem = (id: number, dateFrom: number, dateTo: number) => {
    setItems(items.filter(item => item.id !== id && item.dateFrom !== dateFrom && item.dateTo === dateTo));
  };

  const updateItem = (id: number, field: keyof QuoteItem, value: any) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const goBack = () => {
    navigate('/');
  };

  const convertTimestampToDate = (timestamp: number) => {
    return format(new Date(timestamp*1000), 'dd-MM-yyyy');
  };

  const handleConvertQuote = async () => {
    setIsSaving(true);
    await generatorService.convertQuote(quote);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-8">
          <QuoteIcon className="w-8 h-8 text-blue-600" />
          <h3 className="text-l text-gray-600">Create Quote</h3>
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
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Customer Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(CURRENCIES.find(c => c === e.target.value) || CURRENCIES[0])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Frequency</label>
            <select
              value={defaultBillingFrequency}
              onChange={(e) => {
                setDefaultBillingFrequency(BILLING_FREQUENCIES.find(f => f.value === e.target.value)?.value || defaultBillingFrequency)
              }}
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item name
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
              {
                Object.keys(groupedItems).map((dateRange: string) => (
                  <React.Fragment key={dateRange}>
                    <tr>
                      <td className="px-6 py-4" colSpan={5}><span>{dateRange}</span></td>
                      <td>
                        <button
                          onClick={() => addItem(groupedItems[dateRange][0])}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add Item
                        </button>
                      </td>
                    </tr>
                    {groupedItems[dateRange].map((item: QuoteItem, index: number) => (
                      <tr key={item.id || index}>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Item name"
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
                        <td className="px-6 py-4 flex-cell" style={{position: 'relative'}}>
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 field-prefix">
                            <span className="text-gray-500 sm:text-sm">{item.currencyCode}</span>
                          </div>
                          <div className="relative rounded-md shadow-sm">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                              className="block w-32 rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={item.billingFrequency}
                            onChange={(e) => updateItem(
                              item.id,
                              'billingFrequency',
                              BILLING_FREQUENCIES.find(f => f.value === e.target.value)?.value || defaultBillingFrequency
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
                          {formatCurrency(item.quantity * item.price)}
                          <span className="text-xs text-gray-500 block">
                            {item.billingFrequency}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeItem(item.id, item.dateFrom, item.dateTo)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              }
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-6 py-4 text-right font-medium">
                  Total Amount:
                </td>
                <td className="px-6 py-4 text-lg font-bold text-gray-900">
                  {formatCurrency(calculateTotal())}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <Row>
          <Form.Label>Quote summary</Form.Label>
          <Form.Control as='textarea' rows={10} value={quoteSummary} onChange={(event) => setQuoteSummary(event.target.value)} style={{backgroundColor: 'aliceblue'}} />
        </Row>
        <Row>
          <Col style={{textAlign: 'right', marginTop: '2rem'}}>
            <Button variant='default' onClick={goBack}>Cancel</Button>
            <Button variant='primary' onClick={handleConvertQuote} disabled={isSaving}>
              Create {isSaving && <Spinner variant='light' size='sm' />}
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default CreateQuote;