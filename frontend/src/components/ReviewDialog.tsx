import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { TextField } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import axios, { AxiosError } from "axios";
import StarRatings from "react-star-ratings";
import LoginDialog from "@/components/LoginDialogComponent";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";
import { JwtCookie } from "@/types/JwtCookie";
import { useRouter } from "next/router";
interface Props {
    isOpen: boolean;
    setOpenDialog: (value: boolean) => void;
    doctorId: string;
    doctorName: string;
}

const ReviewDialog: React.FC<Props> = ({ isOpen, setOpenDialog, doctorId, doctorName }) => {
    const [rating, setRating] = useState<number>(0.0);
    const router = useRouter();
    const userContext = useContext(UserContext);
    const [comment, setComment] = useState("");
    const user = useContext(UserContext);
    const handleReview = () => {
        const cookie: string | null = localStorage.getItem("user_info");
        if (cookie === null) {
            return;
        }
        const jwt_cookie: JwtCookie = JSON.parse(cookie);
        var config = {};
        try {
            config = {
                headers: {
                    Authorization: `Bearer ${jwt_cookie.jwt}`,
                },
            };
        } catch (err) {}
        axios
            .post(
                axios.defaults.baseURL + "/krsp/ratings/create_review/",
                {
                    doctor_id: doctorId,
                    rating: rating,
                    comment: comment,
                },
                config
            )
            .catch((err: AxiosError) => {
                if (err.response?.status === 401) {
                    userContext.logout();
                    localStorage.removeItem("user_info");
                    sessionStorage.removeItem("guest_info");
                    router.push("/Login");
                }
            });
        setOpenDialog(false);
    };
    const changeRating = (newRating: number) => {
        setRating(newRating);
    };
    return (
        <>
            <Dialog open={isOpen} onClose={() => setOpenDialog(false)} fullWidth={true}>
                <DialogTitle>Rate Dr.{doctorName}</DialogTitle>
                <DialogContent>
                    <StarRatings
                        rating={rating}
                        starRatedColor="#FFD700"
                        changeRating={changeRating}
                        numberOfStars={5}
                        name="rating"
                    />
                    <TextField
                        multiline
                        id="my-textarea"
                        aria-label="my textarea"
                        fullWidth
                        label="Comments"
                        rows={4}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} variant="contained" color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleReview} variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <LoginDialog isOpen={!user.isAuthenticated && isOpen} />
        </>
    );
};

export default ReviewDialog;
