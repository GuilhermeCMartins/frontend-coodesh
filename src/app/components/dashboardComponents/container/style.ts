import { styled } from "@/app/stitches.config";


const Cards = styled("section", {

    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 8px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "12px",
    variants: {
        type: {
            transactions: {
                display: "flex",

            },
            filters: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            navbar: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 4rem"
            }
        }
    }
})


export {
    Cards
}