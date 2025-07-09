package org.example.dto;

import java.math.BigDecimal;

public class CategorySummaryDto {
    private String categoryName;
    private BigDecimal amount;
    private String color;
    private String icon;
    private double percentage;

    public CategorySummaryDto() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private CategorySummaryDto dto = new CategorySummaryDto();

        public Builder categoryName(String categoryName) {
            dto.categoryName = categoryName;
            return this;
        }

        public Builder amount(BigDecimal amount) {
            dto.amount = amount;
            return this;
        }

        public Builder color(String color) {
            dto.color = color;
            return this;
        }

        public Builder icon(String icon) {
            dto.icon = icon;
            return this;
        }

        public Builder percentage(double percentage) {
            dto.percentage = percentage;
            return this;
        }

        public CategorySummaryDto build() {
            return dto;
        }
    }

    // Getters and Setters
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}
