USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Assignments_InsertPositions]    Script Date: 5/12/2023 5:36:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Kaitlyn Walton
-- Create date: 5/12/2023
-- Description: Assignments with BatchInsert of Official Positions
--			    
-- Code Reviewer: Chris Cheng

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

CREATE proc [dbo].[Assignments_InsertPositions]
				@GameId int,
				@AssignmentTypeId int,
				@BatchInsertPositions dbo.BatchInsertPositionsTwo READONLY,
				@Fee decimal(8,2),				
				@CreatedBy int,
  			    @ModifiedBy int

as
/*

	DECLARE @GameId int = 8
			,@AssignmentTypeId int = 1
			,@BatchInsertPositions dbo.BatchInsertPositionsTwo
			,@Fee decimal(8,2) = 50		
			,@CreatedBy int = 6
  			,@ModifiedBy int = 6

	INSERT INTO @BatchInsertPositions (PositionId, UserId, AssignmentStatusId)
	VALUES (1, 33, 1), (2, 44, 1), (3, 19, 1), (4, 113, 1)

	EXECUTE dbo.Assignments_InsertPositions
							@GameId
							,@AssignmentTypeId
							,@BatchInsertPositions
							,@Fee
							,@CreatedBy
							,@ModifiedBy

	SELECT *
	FROM dbo.Assignments
	WHERE GameId = @GameId
*/
BEGIN

	Declare @newIds table ( [Id] int )

	INSERT INTO [dbo].[Assignments]
			   ([GameId]
			   ,[AssignmentTypeId]
			   ,[PositionId]
			   ,[UserId]			   
			   ,[AssignmentStatusId]
			   ,[Fee]
			   ,[CreatedBy]
			   ,[ModifiedBy])

	Output inserted.[Id] 
	Into @newIds
     
	SELECT		@GameId
				,@AssignmentTypeId
				,b.[PositionId]
				,b.[UserId]				
				,b.[AssignmentStatusId]
				,@Fee
				,@CreatedBy
  			    ,@ModifiedBy
	FROM @BatchInsertPositions as b 

	Select n.[Id]
	from @newIds as n inner join dbo.Assignments as a
				on n.[Id] = a.[Id]
	where n.[Id] = a.[Id]


END
GO
