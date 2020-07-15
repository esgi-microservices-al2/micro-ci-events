namespace ESGI.DesignPattern.Projet
{
    public class ReceiptBuidler
    {
        private Money _amount;
        private int _tax;
        public ReceiptBuidler withAmount(Money amount)
        {
            _amount = amount;
            return this;
        }

        public ReceiptBuidler withTax(int tax)
        {
            _tax = tax;
            return this;
        }

        public Receipt build()
        {
            Receipt receipt = new Receipt();
            var vat = _amount.Percentage(20);

            receipt.Amount = _amount;
            receipt.Tax = vat;
            receipt.Total = _amount.Add(vat);
            return receipt;
        }
    }
}