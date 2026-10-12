package com.allinago.inventory.dto;

public class TrackingUpdateDTO {
    private String shippingStatus; // "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"
    private String trackingNumber;
    private String carrier;
    private String estimatedDelivery;

    public TrackingUpdateDTO() {}

    public String getShippingStatus() { return shippingStatus; }
    public void setShippingStatus(String shippingStatus) { this.shippingStatus = shippingStatus; }
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }
    public String getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(String estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }
}
