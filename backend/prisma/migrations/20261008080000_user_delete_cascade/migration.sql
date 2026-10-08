-- Account deletion: cascade user-authored rows instead of blocking.
-- Fixes P2003 ("trips_creator_id_fkey") on DELETE /v1/users/me — spec
-- (WORKFLOW §5 / Screen20) says deleting an account removes the user's
-- trips and other authored data.

ALTER TABLE "trips" DROP CONSTRAINT "trips_creator_id_fkey",
  ADD CONSTRAINT "trips_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trip_invitations" DROP CONSTRAINT "trip_invitations_invited_by_fkey",
  ADD CONSTRAINT "trip_invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trip_polls" DROP CONSTRAINT "trip_polls_created_by_fkey",
  ADD CONSTRAINT "trip_polls_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trip_messages" DROP CONSTRAINT "trip_messages_sender_id_fkey",
  ADD CONSTRAINT "trip_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trip_documents" DROP CONSTRAINT "trip_documents_uploaded_by_fkey",
  ADD CONSTRAINT "trip_documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
