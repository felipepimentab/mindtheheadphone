#!/bin/bash

# Script to download headphone images with slugified names
# Usage: ./download_headphones_with_names.sh [input_file] [output_directory]

# Default values
INPUT_FILE="${1:-/Users/felipepimenta/Developer/mindtheheadphone/shared/utils/headphones.ts}"
OUTPUT_DIR="${2:-downloads/headphone-images-named}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to convert text to slug
create_slug() {
    local text="$1"
    # Convert to lowercase, replace spaces and special chars with hyphens, remove multiple hyphens
    echo "$text" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g'
}

# Function to get file extension from URL
get_extension() {
    local url="$1"
    # Extract extension from URL, default to .jpg if not found
    local ext=$(echo "$url" | sed 's/.*\.//' | grep -E '^(jpg|jpeg|png|gif|webp|svg)$' || echo "jpg")
    echo ".$ext"
}

# Check if input file exists
if [[ ! -f "$INPUT_FILE" ]]; then
    echo -e "${RED}Error: Input file '$INPUT_FILE' not found!${NC}"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}Downloading headphone images with slugified names...${NC}"
echo -e "${BLUE}Input file: $INPUT_FILE${NC}"
echo -e "${BLUE}Output directory: $OUTPUT_DIR${NC}"
echo

# Extract headphone data (img and name pairs)
# This regex looks for objects with both img and name properties
temp_file=$(mktemp)

# Extract each headphone object
grep -n "img:" "$INPUT_FILE" | while read -r line; do
    line_num=$(echo "$line" | cut -d: -f1)
    
    # Get the img URL from current line
    img_url=$(echo "$line" | sed "s/.*img: *['\"]//; s/['\"].*//")
    
    # Look for the name field in the next few lines after img
    name=$(sed -n "${line_num},$(($line_num + 10))p" "$INPUT_FILE" | grep "name:" | head -1 | sed "s/.*name: *['\"]//; s/['\"].*//")
    
    if [[ -n "$img_url" && -n "$name" ]]; then
        echo "$img_url|$name" >> "$temp_file"
    fi
done

# Check if we found any headphones
if [[ ! -s "$temp_file" ]]; then
    echo -e "${RED}No headphone data found in the input file!${NC}"
    rm -f "$temp_file"
    exit 1
fi

# Count total headphones
total_count=$(wc -l < "$temp_file")
echo -e "${GREEN}Found $total_count headphones to download${NC}"
echo

# Download images
count=0
success_count=0
failed_count=0

while IFS='|' read -r img_url name; do
    ((count++))
    
    # Skip empty URLs
    if [[ -z "$img_url" || "$img_url" == "null" ]]; then
        echo -e "${YELLOW}[$count/$total_count] Skipping '$name' - no image URL${NC}"
        ((failed_count++))
        continue
    fi
    
    # Create slug from name
    slug=$(create_slug "$name")
    
    # Get file extension
    extension=$(get_extension "$img_url")
    
    # Create filename
    filename="${slug}${extension}"
    filepath="$OUTPUT_DIR/$filename"
    
    echo -e "${BLUE}[$count/$total_count] Downloading '$name' -> '$filename'${NC}"
    
    # Download the image
    if curl -L -s -f -o "$filepath" "$img_url"; then
        echo -e "${GREEN}✓ Successfully downloaded: $filename${NC}"
        ((success_count++))
    else
        echo -e "${RED}✗ Failed to download: $img_url${NC}"
        ((failed_count++))
        # Remove failed download file if it exists
        [[ -f "$filepath" ]] && rm -f "$filepath"
    fi
    
    # Small delay to be respectful to the server
    sleep 0.5
done < "$temp_file"

# Cleanup
rm -f "$temp_file"

echo
echo -e "${GREEN}Download completed!${NC}"
echo -e "${GREEN}Successfully downloaded: $success_count images${NC}"
echo -e "${RED}Failed downloads: $failed_count images${NC}"
echo -e "${BLUE}Images saved to: $OUTPUT_DIR${NC}"

# Show some examples of downloaded files
if [[ $success_count -gt 0 ]]; then
    echo
    echo -e "${BLUE}Sample downloaded files:${NC}"
    ls "$OUTPUT_DIR" | head -5
    if [[ $(ls "$OUTPUT_DIR" | wc -l) -gt 5 ]]; then
        echo "... and $(( $(ls "$OUTPUT_DIR" | wc -l) - 5 )) more files"
    fi
fi