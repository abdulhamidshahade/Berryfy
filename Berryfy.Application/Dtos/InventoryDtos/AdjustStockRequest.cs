namespace Berryfy.Application.Dtos.InventoryDtos
{
    public class AdjustStockRequest
    {
        public int ProductId { get; set; }
        public int NewQuantity { get; set; }
        public string Notes { get; set; }
        public int? PerformedByUserId { get; set; }
    }
}
